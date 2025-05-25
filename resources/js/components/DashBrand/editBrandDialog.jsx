import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';
import { router } from '@inertiajs/react';

export default function EditBrandDialog({ isOpen, onClose, onSave, brand }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});

    // Initialize form with brand data when component opens
    useEffect(() => {
        if (brand && isOpen) {
            setName(brand.name || '');
            setDescription(brand.description || '');
            setLogoPreview(brand.logo ? `/storage/${brand.logo}` : null);
        }
    }, [brand, isOpen]);

    const resetForm = () => {
        if (brand) {
            setName(brand.name || '');
            setDescription(brand.description || '');
            setLogoPreview(brand.logo ? `/storage/${brand.logo}` : null);
        } else {
            setName('');
            setDescription('');
            setLogo(null);
            setLogoPreview(null);
        }
        setErrors({});
    };

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        if (file) {
            setLogo(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleUpdate = () => {
        if (!name) {
            setErrors({ name: 'El nombre es requerido' });
            return;
        }

        const formData = new FormData();
        formData.append('_method', 'PATCH'); // Laravel method spoofing
        formData.append('name', name);
        formData.append('description', description);
        if (logo) {
            formData.append('logo', logo);
        }

        router.post(route('dashboard.brand.update', brand.id), formData, {
            onSuccess: () => {
                onSave({
                    ...brand,
                    name,
                    description,
                    logo: logoPreview
                });
                onClose();
            },
            onError: (errors) => {
                setErrors(errors);
            },
        });
    };

    return (
        <Dialog open={isOpen} onClose={() => { resetForm(); onClose(); }} className="relative z-50">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative mx-auto p-5 border w-full max-w-lg shadow-lg rounded-md bg-white">
                    <button 
                        onClick={() => { resetForm(); onClose(); }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <div className="mt-3 text-center">
                        <h3 className="text-lg text-left leading-6 font-medium text-gray-900 mb-4">Editar Marca</h3>
                        <div className="mt-2">
                            <label className="block text-sm text-left font-medium text-gray-700 mb-2">Nombre <span className="text-red-500">*</span></label>
                            <input
                                type="text"
                                placeholder="Nombre de la marca"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                            <label className="block text-sm font-medium text-left text-gray-700 mb-2">Descripción</label>
                            <textarea
                                placeholder="Descripción de la marca"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-3 py-2 mb-2 border rounded-lg focus:outline-none focus:border-blue-500"
                            />
                            <label className="block text-sm text-left font-medium text-gray-700 mb-2">Logo</label>
                            <div 
                                className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center cursor-pointer"
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onClick={() => document.getElementById('logo-upload-edit').click()}
                            >
                                {logoPreview ? (
                                    <div className="flex flex-col items-center">
                                        <img 
                                            src={logoPreview} 
                                            alt="Preview" 
                                            className="max-h-40 mb-2 object-contain" 
                                        />
                                        <p className="text-sm text-gray-500">Haz clic para cambiar la imagen</p>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Arrastra y suelta un archivo aquí, o haz clic para seleccionar un archivo
                                        </p>
                                    </div>
                                )}
                                <input
                                    id="logo-upload-edit"
                                    name="logo"
                                    type="file"
                                    className="hidden"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                />
                            </div>
                        </div>
                        <div className="mt-5 flex justify-end">
                            <button
                                type="button"
                                className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                                onClick={() => { resetForm(); onClose(); }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="button"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none"
                                onClick={handleUpdate}
                            >
                                Actualizar
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}