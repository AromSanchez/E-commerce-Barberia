import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage, router } from '@inertiajs/react';
import HeadAdmin from '@/Layouts/head_admin/HeadAdmin';
import NavAdmin from '@/Layouts/nav_admin/NavAdmin';
import { useState, useEffect } from 'react';
import { ShoppingBag, Package } from 'lucide-react';

export default function DashAddProduct() {
    const { categories, brands } = usePage().props;
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        short_description: '',
        description: '',
        regular_price: '',
        sale_price: '',
        sku: '',
        quantity: '',
        category_id: '',
        brand_id: '',
        featured: 'No',
        stock_status: 'instock'
    });
    const [mainImage, setMainImage] = useState(null);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [galleryImages, setGalleryImages] = useState([]);
    const [galleryImagePreviews, setGalleryImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Generar slug automáticamente a partir del nombre
    useEffect(() => {
        if (formData.name) {
            const generatedSlug = formData.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.name]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            setGalleryImages(prev => [...prev, ...files]);
            
            // Crear previsualizaciones para las imágenes de la galería
            const readers = files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then(results => {
                setGalleryImagePreviews(prev => [...prev, ...results]);
            });
        }
    };

    const handleMainImageDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setMainImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryImagesDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            setGalleryImages(prev => [...prev, ...files]);
            
            // Crear previsualizaciones para las imágenes de la galería
            const readers = files.map(file => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    };
                    reader.readAsDataURL(file);
                });
            });

            Promise.all(readers).then(results => {
                setGalleryImagePreviews(prev => [...prev, ...results]);
            });
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const productData = new FormData();
        
        // Añadir todos los campos del formulario
        Object.keys(formData).forEach(key => {
            productData.append(key, formData[key]);
        });

        // Añadir imagen principal
        if (mainImage) {
            productData.append('image', mainImage);
        }

        // Añadir imágenes de galería
        galleryImages.forEach((image, index) => {
            productData.append(`gallery[${index}]`, image);
        });

        router.post(route('dashboard.product.store'), productData, {
            onSuccess: () => {
                setProcessing(false);
                router.visit(route('dashboard.product'));
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Añadir Producto" />
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
                                    <h2 className="text-xl font-semibold">Añadir Producto</h2>
                                </div>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* Columna izquierda */}
                                        <div className="space-y-6">
                                            {/* Nombre del producto */}
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Nombre del producto <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese nombre del producto"
                                                    required
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 100 caracteres cuando escriba el nombre del producto.</p>
                                            </div>

                                            {/* Slug */}
                                            <div>
                                                <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Slug <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="slug"
                                                    name="slug"
                                                    value={formData.slug}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese slug del producto"
                                                    required
                                                />
                                                {errors.slug && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 100 caracteres cuando escriba el slug del producto.</p>
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
                                                    {categories && categories.map(category => (
                                                        <option key={category.id} value={category.id}>
                                                            {category.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category_id && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
                                                )}
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
                                                    {brands && brands.map(brand => (
                                                        <option key={brand.id} value={brand.id}>
                                                            {brand.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.brand_id && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.brand_id}</p>
                                                )}
                                            </div>

                                            {/* Descripción corta */}
                                            <div>
                                                <label htmlFor="short_description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción corta <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="short_description"
                                                    name="short_description"
                                                    value={formData.short_description}
                                                    onChange={handleChange}
                                                    rows="3"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese una descripción corta"
                                                    required
                                                ></textarea>
                                                {errors.short_description && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.short_description}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 100 caracteres cuando escriba la descripción del producto.</p>
                                            </div>

                                            {/* Descripción completa */}
                                            <div>
                                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Descripción <span className="text-red-500">*</span>
                                                </label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={formData.description}
                                                    onChange={handleChange}
                                                    rows="6"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese una descripción detallada"
                                                    required
                                                ></textarea>
                                                {errors.description && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                                                )}
                                                <p className="text-xs text-gray-500 mt-1">No exceder 100 caracteres cuando escriba la descripción del producto.</p>
                                            </div>
                                        </div>

                                        {/* Columna derecha */}
                                        <div className="space-y-6">
                                            {/* Subir imágenes principales */}
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
                                                    {mainImagePreview ? (
                                                        <div className="flex flex-col items-center">
                                                            <img 
                                                                src={mainImagePreview} 
                                                                alt="Vista previa" 
                                                                className="max-h-40 mb-2 object-contain" 
                                                            />
                                                            <p className="text-sm text-gray-500">Haz clic para cambiar la imagen</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <div className="mb-2">
                                                                <svg className="mx-auto h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Arrastra tus imágenes aquí o <span className="text-blue-500">haz clic para buscar</span></p>
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

                                            {/* Subir imágenes de galería */}
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                                    Subir imágenes de galería
                                                </label>
                                                <div 
                                                    className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer"
                                                    onDrop={handleGalleryImagesDrop}
                                                    onDragOver={handleDragOver}
                                                    onClick={() => document.getElementById('gallery-images-upload').click()}
                                                >
                                                    {galleryImagePreviews.length > 0 ? (
                                                        <div className="flex flex-wrap gap-2 justify-center">
                                                            {galleryImagePreviews.map((preview, index) => (
                                                                <img 
                                                                    key={index}
                                                                    src={preview} 
                                                                    alt={`Galería ${index + 1}`} 
                                                                    className="h-20 w-20 object-cover rounded-md" 
                                                                />
                                                            ))}
                                                            <p className="w-full text-sm text-gray-500 mt-2">Haz clic para añadir más imágenes</p>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center">
                                                            <div className="mb-2">
                                                                <svg className="mx-auto h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                                                </svg>
                                                            </div>
                                                            <p className="text-sm text-gray-600">Arrastra tus imágenes aquí o <span className="text-blue-500">haz clic para buscar</span></p>
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
                                                    type="number"
                                                    step="0.01"
                                                    id="regular_price"
                                                    name="regular_price"
                                                    value={formData.regular_price}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese precio regular"
                                                    required
                                                />
                                                {errors.regular_price && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.regular_price}</p>
                                                )}
                                            </div>

                                            {/* Precio de venta */}
                                            <div>
                                                <label htmlFor="sale_price" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Precio de venta
                                                </label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="sale_price"
                                                    name="sale_price"
                                                    value={formData.sale_price}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese precio de venta"
                                                />
                                                {errors.sale_price && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.sale_price}</p>
                                                )}
                                            </div>

                                            {/* SKU */}
                                            <div>
                                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                                                    SKU <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="sku"
                                                    name="sku"
                                                    value={formData.sku}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese SKU"
                                                    required
                                                />
                                                {errors.sku && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.sku}</p>
                                                )}
                                            </div>

                                            {/* Cantidad */}
                                            <div>
                                                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Cantidad <span className="text-red-500">*</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="quantity"
                                                    name="quantity"
                                                    value={formData.quantity}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Ingrese cantidad"
                                                    required
                                                />
                                                {errors.quantity && (
                                                    <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>
                                                )}
                                            </div>

                                            {/* Stock */}
                                            <div>
                                                <label htmlFor="stock_status" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Stock
                                                </label>
                                                <select
                                                    id="stock_status"
                                                    name="stock_status"
                                                    value={formData.stock_status}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="instock">En stock</option>
                                                    <option value="outofstock">Agotado</option>
                                                </select>
                                            </div>

                                            {/* Destacado */}
                                            <div>
                                                <label htmlFor="featured" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Destacado
                                                </label>
                                                <select
                                                    id="featured"
                                                    name="featured"
                                                    value={formData.featured}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                                >
                                                    <option value="No">No</option>
                                                    <option value="Yes">Sí</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Botón de envío */}
                                    <div className="mt-8">
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                                        >
                                            {processing ? 'Guardando...' : 'Añadir producto'}
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