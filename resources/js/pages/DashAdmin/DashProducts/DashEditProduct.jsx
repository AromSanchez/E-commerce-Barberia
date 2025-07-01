import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/layouts/head_admin/HeadAdmin';
import NavAdmin from '@/layouts/nav_admin/NavAdmin';
import { useState } from 'react';
import { ShoppingBag } from 'lucide-react';

export default function DashEditProduct({ product, categories, brands }) {
    const [formData, setFormData] = useState({
        name: product.name || '',
        regular_price: product.regular_price || '',
        sale_price: product.sale_price || '',
        category_id: product.category_id || '',
        brand_id: product.brand_id || '',
        is_featured: product.is_featured || 'no',
        is_new: product.is_new === 'yes' ? 'yes' : 'no',
        stock: product.stock || '',
        short_description: product.short_description || '',
        long_description: product.long_description || '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(product.image ? `/storage/${product.image}` : null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [galleryImages, setGalleryImages] = useState([]); // Nuevas imágenes seleccionadas (File[])
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]); // Nuevas previews (base64)
    const [existingGalleryImages, setExistingGalleryImages] = useState(product.images || []); // Imágenes existentes desde la DB
    const [deletedImageIds, setDeletedImageIds] = useState([]); // IDs de imágenes eliminadas



    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryImages(prev => [...prev, ...files]);

            const readers = files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then(results => {
                setGalleryImagePreviews(prev => [...prev, ...results]);
            });
        }
    };

    const handleGalleryImagesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        handleGalleryImagesChange({ target: { files } });
    };

    const handleRemoveGalleryImage = (index) => {
        setGalleryImages(prev => prev.filter((_, i) => i !== index));
        setGalleryImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleDeleteExistingImage = (id) => {
        setDeletedImageIds(prev => [...prev, id]);
        setExistingGalleryImages(prev => prev.filter(img => img.id !== id));
    };
    function handleChange(e) {
        const { name, value, files } = e.target;

        if (name === 'image' && files.length > 0) {
            setFormData((prev) => ({ ...prev, image: files[0] }));
            setImagePreview(URL.createObjectURL(files[0]));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    }
    function handleMainImageDrop(e) {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleMainImageChange(e) {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    }
    function handleRemoveExistingGalleryImage(imageId) {
        // Elimina visualmente la imagen
        setExistingGalleryImages((prev) => prev.filter(img => img.id !== imageId));

        // Guarda el ID para eliminarlo en el backend
        setDeletedImageIds((prev) => [...prev, imageId]);
    }

    function handleSubmit(e) {
        e.preventDefault();
        setProcessing(true);

        const data = new FormData();

        for (const key in formData) {
            if (formData[key] !== null) {
                data.append(key, formData[key]);
            }
        }

        galleryImages.forEach((file, index) => {
            data.append(`gallery_images[]`, file);
        });

        deletedImageIds.forEach((id) => {
            data.append('deleted_gallery_image_ids[]', id);
        });

        data.append('_method', 'PATCH');

        router.post(route('dashboard.products.update', product.id), data, {
            onSuccess: () => {
                setProcessing(false);
                router.visit(route('dashboard.product'));
            },
            onError: (errors) => {
                setErrors(errors);
                setProcessing(false);
            },
        });
    }

    return (
        <AuthenticatedLayout>
            <Head title={`Editar Producto - ${formData.name || 'Producto'}`} />
            <div className="flex h-screen">
                <div className="fixed left-0 h-full">
                    <NavAdmin isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
                </div>
                <div className={`flex-1 transition-all duration-300 ${isCollapsed ? 'ml-20' : 'ml-64'}`}>
                    <div className="fixed top-0 right-0 z-10 bg-white" style={{ left: isCollapsed ? 80 : 256 }}>
                        <HeadAdmin />
                    </div>
                    <div className="pt-[73px] h-screen bg-[#F2F7FB] overflow-y-auto">
                        <div className="p-8">
                            {/* Encabezado y título */}
                            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <ShoppingBag className="text-blue-600 w-6 h-6" />
                                    </div>
                                    <h2 className="text-xl font-semibold">Editar Producto</h2>
                                </div>

                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Columna izquierda */}
                                        <div className="space-y-6">
                                            {/* Nombre */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    maxLength={255}
                                                    required
                                                />
                                                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                                            </div>

                                            {/* Categoría */}
                                            <div>
                                                <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Categoría <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="category_id"
                                                    name="category_id"
                                                    value={formData.category_id}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Seleccione categoría</option>
                                                    {categories.map(cat => (
                                                        <option key={cat.id} value={cat.id}>
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>}
                                            </div>

                                            {/* Marca */}
                                            <div>
                                                <label htmlFor="brand_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Marca <span className="text-red-500">*</span>
                                                </label>
                                                <select
                                                    id="brand_id"
                                                    name="brand_id"
                                                    value={formData.brand_id}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    required
                                                >
                                                    <option value="">Seleccione marca</option>
                                                    {brands.map(brand => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.brand_id && <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>}
                                            </div>

                                            {/* Descripción corta */}
                                            <div>
                                                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción corta
                                                </label>
                                                <textarea
                                                    id="short_description"
                                                    name="short_description"
                                                    value={formData.short_description}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    maxLength={100}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.short_description && <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 100 caracteres.</p>
                                            </div>

                                            {/* Descripción completa */}
                                            <div>
                                                <label htmlFor="long_description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción completa
                                                </label>
                                                <textarea
                                                    id="long_description"
                                                    name="long_description"
                                                    value={formData.long_description}
                                                    onChange={handleChange}
                                                    rows="6"
                                                    maxLength={1000}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                />
                                                {errors.long_description && <p className="mt-1 text-sm text-red-600">{errors.long_description}</p>}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 1000 caracteres.</p>
                                            </div>
                                        </div>

                                        {/* Columna derecha */}
                                        <div className="space-y-6">
                                            {/* Imagen */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Subir imágenes <span className="text-red-500">*</span>
                                                </label>

                                                <div
                                                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer"
                                                    onDrop={handleMainImageDrop}
                                                    onDragOver={handleDragOver}
                                                    onClick={() => document.getElementById('main-image-upload').click()}
                                                >
                                                    {imagePreview ? (
                                                        <div className="flex flex-col items-center">
                                                            <img
                                                                src={imagePreview}
                                                                alt="Vista previa"
                                                                className="max-h-40 mb-2 object-contain"
                                                            />
                                                            <p className="text-sm text-gray-500">Haz clic para cambiar la imagen</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <div className="mb-2">
                                                                <svg
                                                                    className="mx-auto h-12 w-12 text-blue-500"
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    fill="none"
                                                                    viewBox="0 0 24 24"
                                                                    stroke="currentColor"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={2}
                                                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                    />
                                                                </svg>
                                                            </div>
                                                            <p className="text-sm text-gray-600">
                                                                Arrastra tus imágenes aquí o <span className="text-blue-500">haz clic para buscar</span>
                                                            </p>
                                                        </div>
                                                    )}

                                                    <input
                                                        id="main-image-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleMainImageChange}
                                                        className="hidden"
                                                    />
                                                </div>

                                                {errors.image && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                                                )}
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Subir imágenes de galería
                                                </label>

                                                <div
                                                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 cursor-pointer bg-white hover:bg-blue-50 transition"
                                                    onDrop={handleGalleryImagesDrop}
                                                    onDragOver={handleDragOver}
                                                    onClick={() => document.getElementById('gallery-images-upload').click()}
                                                >
                                                    {(galleryImagePreviews.length > 0 || existingGalleryImages.length > 0) ? (
                                                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                                            {/* Imágenes ya existentes (desde la base de datos) */}
                                                            {existingGalleryImages.map((img, index) => (
                                                                <div key={`existing-${img.id}`} className="relative group w-full aspect-square">
                                                                    <img
                                                                        src={`/storage/${img.image_path}`}
                                                                        alt={`Imagen actual ${index + 1}`}
                                                                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveExistingGalleryImage(img.id);
                                                                        }}
                                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                                                        title="Eliminar"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            {/* Imágenes nuevas seleccionadas */}
                                                            {galleryImagePreviews.map((preview, index) => (
                                                                <div key={`new-${index}`} className="relative group w-full aspect-square">
                                                                    <img
                                                                        src={preview}
                                                                        alt={`Nueva galería ${index + 1}`}
                                                                        className="w-full h-full object-cover rounded-lg border shadow-sm"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            handleRemoveGalleryImage(index);
                                                                        }}
                                                                        className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition"
                                                                        title="Eliminar"
                                                                    >
                                                                        ×
                                                                    </button>
                                                                </div>
                                                            ))}

                                                            <div className="flex items-center justify-center text-center border-2 border-dashed border-gray-300 rounded-lg h-full min-h-[96px] p-4 text-sm text-gray-500 col-span-full">
                                                                Haz clic para añadir más imágenes
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-32">
                                                            <svg
                                                                className="mx-auto h-10 w-10 text-blue-400"
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                fill="none"
                                                                viewBox="0 0 24 24"
                                                                stroke="currentColor"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                />
                                                            </svg>
                                                            <p className="mt-2 text-sm text-gray-600">
                                                                Arrastra tus imágenes aquí o <span className="text-blue-500">haz clic para buscar</span>
                                                            </p>
                                                        </div>
                                                    )}
                                                    <input
                                                        id="gallery-images-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handleGalleryImagesChange}
                                                        className="hidden"
                                                    />
                                                </div>

                                                {errors.gallery && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.gallery}</p>
                                                )}
                                            </div>


                                            {/* Precio regular */}
                                            <div>
                                                <label htmlFor="regular_price" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Precio regular <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="regular_price"
                                                    name="regular_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.regular_price}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                    required
                                                />
                                                {errors.regular_price && <p className="mt-1 text-sm text-red-600">{errors.regular_price}</p>}
                                            </div>

                                            {/* Precio de venta */}
                                            <div>
                                                <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Precio de venta
                                                </label>
                                                <input
                                                    id="sale_price"
                                                    name="sale_price"
                                                    type="number"
                                                    step="0.01"
                                                    value={formData.sale_price}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                />
                                                {errors.sale_price && <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>}
                                            </div>

                                            {/* Stock */}
                                            <div>
                                                <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Stock <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    id="stock"
                                                    name="stock"
                                                    type="number"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    min="0"
                                                    required
                                                />
                                                {errors.stock && <p className="mt-1 text-sm text-red-600">{errors.stock}</p>}
                                            </div>

                                            {/* Destacado */}
                                            <div>
                                                <label htmlFor="is_featured" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Destacado
                                                </label>
                                                <select
                                                    id="is_featured"
                                                    name="is_featured"
                                                    value={formData.is_featured}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="no">No</option>
                                                    <option value="yes">Sí</option>
                                                </select>
                                            </div>

                                            {/* Nuevo */}
                                            <div>
                                                <label htmlFor="is_new" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nuevo
                                                </label>
                                                <select
                                                    id="is_new"
                                                    name="is_new"
                                                    value={formData.is_new}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="no">No</option>
                                                    <option value="yes">Sí</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón Guardar */}
                                    <div className="mt-8 flex justify-end">
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md transition"
                                            disabled={processing}
                                        >
                                            {processing ? 'Guardando...' : 'Guardar cambios'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>

    );
}
