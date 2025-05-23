import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { router } from '@inertiajs/react';
import { X } from 'lucide-react';

export default function AddCategoryDialog({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        if (!isOpen) {
            // Resetear el formulario cuando se cierra el diálogo
            setName('');
            setSlug('');
            setImage(null);
            setImagePreview(null);
            setErrors({});
        }
    }, [isOpen]);

    // Generar slug automáticamente a partir del nombre
    useEffect(() => {
        if (name) {
            const generatedSlug = name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+/, '')
                .replace(/-+$/, '');
            setSlug(generatedSlug);
        }
    }, [name]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setProcessing(true);

        const formData = new FormData();
        formData.append('name', name);
        formData.append('slug', slug);
        if (image) {
            formData.append('image', image);
        }

        router.post(route('dashboard.category.store'), formData, {
            onSuccess: (page) => {
                setProcessing(false);
                onSave(page.props.category);
                onClose();
            },
            onError: (errors) => {
                setProcessing(false);
                setErrors(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Dialog.Title className="text-lg font-medium">Añadir Categoría</Dialog.Title>
                        <button 
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Category name"
                                required
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        
                        <div className="mb-4">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Slug <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Category Slug"
                                required
                            />
                            {errors.slug && (
                                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
                            )}
                        </div>
                        
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upload images <span className="text-red-500">*</span>
                            </label>
                            <div 
                                className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('image-upload').click()}
                            >
                                {imagePreview ? (
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
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
                                        <p className="text-sm text-gray-600">Drop your images here or select <span className="text-blue-500">click to browse</span></p>
                                    </div>
                                )}
                                <input
                                    id="image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </div>
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                            )}
                        </div>
                        
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                                {processing ? 'Guardando...' : 'Save'}
                            </button>
                        </div>
                    </form>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}