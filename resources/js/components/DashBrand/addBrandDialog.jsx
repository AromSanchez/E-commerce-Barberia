import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react'; // Assuming you have this icon library

export default function AddBrandDialog({ isOpen, onClose, onSave }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [logo, setLogo] = useState(null);
    const [logoPreview, setLogoPreview] = useState(null);
    const [errors, setErrors] = useState({});

    const resetForm = () => {
        setName('');
        setDescription('');
        setLogo(null);
        setLogoPreview(null);
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

    const handleSave = () => {
        if (!name) {
            setErrors({ name: 'El nombre es requerido' });
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        if (logo) {
            formData.append('logo', logo);
        }

        onSave(formData);
        resetForm();
        onClose();
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
                        <h3 className="text-lg text-left leading-6 font-medium text-gray-900 mb-4">Añadir Marca</h3>
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
                                onClick={() => document.getElementById('logo-upload').click()}
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
                                        <div className="mb-2">
                                            <svg className="mx-auto h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <p className="text-sm text-gray-600">Subir archivo o arrastrar y soltar</p>
                                        <p className="text-xs text-gray-400">PNG, JPG, GIF hasta 2MB</p>
                                    </div>
                                )}
                                <input
                                    id="logo-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <div className="items-center px-4 py-3">
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}