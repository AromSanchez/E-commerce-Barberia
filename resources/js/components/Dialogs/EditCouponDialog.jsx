import React, { useState, useEffect } from 'react';
import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import InputLabel from '@/components/InputLabel';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useForm } from '@inertiajs/react';

// Componente para mostrar visualmente el tipo de cupón
const CouponTypeBadge = ({ type }) => {
    return (
        <div className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
            type === 'fixed' 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-blue-100 text-blue-800 border border-blue-200'
        }`}>
            {type === 'fixed' ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23"></line>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
            ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
            )}
            {type === 'fixed' ? 'Monto Fijo' : 'Porcentaje'}
        </div>
    );
};

// Componente MultiSelect para elegir marcas o categorías
const MultiSelect = ({ options, selectedValues, onChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleOption = (id) => {
        const newSelected = selectedValues.includes(id)
            ? selectedValues.filter(item => item !== id)
            : [...selectedValues, id];
        
        onChange(newSelected);
    };
    
    // Limpiar todas las selecciones
    const clearSelection = () => {
        onChange([]);
    };
    
    // Aplicar a ninguna (comportamiento especial: array vacío)
    const selectNone = () => {
        onChange([]);
    };
    
    return (
        <div className="relative">
            <div 
                className="flex items-center justify-between border border-gray-300 rounded-lg p-2 text-sm cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="flex flex-wrap gap-1 max-w-full">
                    {selectedValues.length > 0 ? (
                        options
                            .filter(option => selectedValues.includes(option.id))
                            .map(option => (
                                <span 
                                    key={option.id}
                                    className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full"
                                >
                                    {option.name}
                                </span>
                            ))
                    ) : (
                        <span className="text-gray-500">{placeholder}</span>
                    )}
                </div>
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </div>
            
            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-40 overflow-y-auto">
                    {/* Opción para seleccionar "Todas" */}
                    <div className="p-1.5 border-b border-gray-100">
                        <div 
                            className="p-1.5 rounded-md text-sm cursor-pointer flex items-center hover:bg-gray-100"
                            onClick={selectNone}
                        >
                            <span className="font-medium text-blue-600 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                {selectedValues.length > 0 ? "Limpiar selección" : "Aplicar a todas"}
                            </span>
                        </div>
                    </div>
                    
                    {options.length === 0 ? (
                        <div className="p-2 text-sm text-gray-500">No hay opciones disponibles</div>
                    ) : (
                        <div className="p-1">
                            {options.map(option => (
                                <div 
                                    key={option.id}
                                    className={`p-1.5 rounded-md text-sm cursor-pointer flex items-center ${
                                        selectedValues.includes(option.id) ? 'bg-blue-50' : 'hover:bg-gray-100'
                                    }`}
                                    onClick={() => toggleOption(option.id)}
                                >
                                    <input 
                                        type="checkbox" 
                                        checked={selectedValues.includes(option.id)} 
                                        readOnly
                                        className="mr-2 rounded border-gray-300"
                                    />
                                    <span>{option.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default function EditCouponDialog({ isOpen, onClose, coupon, onUpdateCoupon, brands, categories }) {
    const { data, setData, errors, reset } = useForm({
        id: '',
        code: '',
        type: 'fixed',
        value: '',
        min_amount: '',
        usage_limit: '',
        usage_count: 0,
        expires_at: '',
        is_active: true,
        brand_ids: [],
        category_ids: [],
    });

    useEffect(() => {
        if (coupon) {
            setData({
                id: coupon.id || '',
                code: coupon.code || '',
                type: coupon.type || 'fixed',
                value: coupon.value || '',
                min_amount: coupon.min_amount || '',
                usage_limit: coupon.usage_limit || '',
                usage_count: coupon.usage_count || 0,
                expires_at: coupon.expires_at ? coupon.expires_at.split('T')[0] : '',
                is_active: coupon.is_active !== undefined ? coupon.is_active : true,
                brand_ids: coupon.brands ? coupon.brands.map(b => b.id) : [],
                category_ids: coupon.categories ? coupon.categories.map(c => c.id) : [],
            });
        }
    }, [coupon]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdateCoupon(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={handleClose} maxWidth="lg">
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="bg-blue-50 p-2 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                            <path d="M10 13H7a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h7a1 1 0 0 1 1 1v2" />
                            <path d="M10 20H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h2" />
                            <path d="M19.2 16.2a3 3 0 0 0-4.2 0L12 19l.7 3.3L16 22l3-2.8a3 3 0 0 0 .2-4.2" />
                        </svg>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">
                        Editar Cupón
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Columna izquierda: Datos principales */}
                    <div className="space-y-3">
                        <div>
                            <InputLabel htmlFor="code" value="Código" className="text-sm font-semibold" />
                            <TextInput
                                id="code"
                                type="text"
                                name="code"
                                value={data.code}
                                className="mt-1 block w-full rounded-lg text-sm py-1.5"
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                required
                            />
                            <InputError message={errors.code} className="mt-1" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-1">
                                <InputLabel htmlFor="type" value="Tipo de Descuento" className="text-sm font-semibold" />
                                <CouponTypeBadge type={data.type} />
                            </div>
                            <select
                                id="type"
                                name="type"
                                value={data.type}
                                className="mt-1 block w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg shadow-sm text-sm py-1.5"
                                onChange={(e) => setData('type', e.target.value)}
                                required
                            >
                                <option value="fixed">Monto Fijo (S/)</option>
                                <option value="percentage">Porcentaje (%)</option>
                            </select>
                            <p className="text-xs text-gray-500 mt-0.5">
                                {data.type === 'fixed' 
                                    ? 'Descuento como monto fijo en soles' 
                                    : 'Descuento como porcentaje del total'
                                }
                            </p>
                            <InputError message={errors.type} className="mt-1" />
                        </div>

                        <div>
                            <InputLabel htmlFor="value" value="Valor" className="text-sm font-semibold" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="value"
                                    type="number"
                                    name="value"
                                    value={data.value}
                                    className="block w-full rounded-lg pl-7 text-sm py-1.5"
                                    onChange={(e) => setData('value', e.target.value)}
                                    step="0.01"
                                    required
                                    placeholder={data.type === 'fixed' ? "10.00" : "25"}
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                    <span className="text-gray-500 text-sm">{data.type === 'fixed' ? 'S/' : '%'}</span>
                                </div>
                            </div>
                            <InputError message={errors.value} className="mt-1" />
                        </div>
                        
                        <div>
                            <InputLabel htmlFor="min_amount" value="Monto Mínimo" className="text-sm font-semibold" />
                            <div className="relative mt-1">
                                <TextInput
                                    id="min_amount"
                                    type="number"
                                    name="min_amount"
                                    value={data.min_amount}
                                    className="block w-full rounded-lg pl-7 text-sm py-1.5"
                                    onChange={(e) => setData('min_amount', e.target.value)}
                                    step="0.01"
                                    placeholder="0.00"
                                />
                                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                                    <span className="text-gray-500 text-sm">S/</span>
                                </div>
                            </div>
                            <InputError message={errors.min_amount} className="mt-1" />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <InputLabel htmlFor="usage_limit" value="Límite de Uso" className="text-sm font-semibold" />
                                <TextInput
                                    id="usage_limit"
                                    type="number"
                                    name="usage_limit"
                                    value={data.usage_limit}
                                    className="mt-1 block w-full rounded-lg text-sm py-1.5"
                                    onChange={(e) => setData('usage_limit', e.target.value)}
                                    placeholder="Sin límite"
                                />
                                <InputError message={errors.usage_limit} className="mt-1" />
                            </div>

                            <div>
                                <InputLabel htmlFor="expires_at" value="Fecha Expiración" className="text-sm font-semibold" />
                                <TextInput
                                    id="expires_at"
                                    type="date"
                                    name="expires_at"
                                    value={data.expires_at}
                                    className="mt-1 block w-full rounded-lg text-sm py-1.5"
                                    onChange={(e) => setData('expires_at', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                <InputError message={errors.expires_at} className="mt-1" />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mt-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={data.is_active}
                                    onChange={(e) => setData('is_active', e.target.checked)}
                                    className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                                />
                                <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">
                                    Cupón Activo
                                </label>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 ml-6">
                                Desactiva el cupón para que no pueda ser utilizado
                            </p>
                        </div>
                    </div>
                    
                    {/* Columna derecha: Restricciones y notas */}
                    <div className="space-y-3">
                        {/* Selección de Marcas y Categorías */}
                        <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 h-full">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path>
                                    <line x1="7" y1="7" x2="7.01" y2="7"></line>
                                </svg>
                                Restricciones (Opcional)
                            </h3>
                            <p className="text-xs text-gray-500 mb-2">
                                Si lo deseas, puedes restringir este cupón para que sólo sea válido en productos de marcas o categorías específicas. Las restricciones funcionan de manera independiente.
                            </p>
                            <div className="p-2 bg-amber-50 rounded-lg mb-2">
                                <p className="text-xs text-amber-800">
                                    Si seleccionas solo marcas, el cupón se aplicará a esas marcas en cualquier categoría. 
                                    Si seleccionas solo categorías, se aplicará a esas categorías en cualquier marca.
                                </p>
                            </div>
                            
                            <div className="space-y-4">
                                <div>
                                    <InputLabel htmlFor="brands" value="Marcas Aplicables" className="text-xs font-semibold" />
                                    <div className="mt-1">
                                        <MultiSelect 
                                            options={brands || []} 
                                            selectedValues={data.brand_ids}
                                            onChange={value => setData('brand_ids', value)}
                                            placeholder="Todas las marcas"
                                        />
                                    </div>                                <p className="text-xs text-gray-500 mt-0.5">
                                    Si no seleccionas ninguna marca, el cupón se aplicará a todas las marcas
                                </p>
                            </div>
                            
                            <div>
                                <InputLabel htmlFor="categories" value="Categorías Aplicables" className="text-xs font-semibold" />
                                <div className="mt-1">
                                    <MultiSelect 
                                        options={categories || []} 
                                        selectedValues={data.category_ids}
                                        onChange={value => setData('category_ids', value)}
                                        placeholder="Todas las categorías"
                                    />
                                </div>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    Si no seleccionas ninguna categoría, el cupón se aplicará a todas las categorías
                                </p>
                                </div>
                            </div>

                            <div className="p-2 bg-amber-50 rounded-lg text-amber-700 text-xs mt-4">
                                <div className="flex items-start gap-1.5">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="12" y1="8" x2="12" y2="12"></line>
                                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                                    </svg>
                                    <div>
                                        <div className="font-medium">Información del Cupón:</div>
                                        <div className="mt-1">Usos: {data.usage_count || 0} {data.usage_limit ? ` / ${data.usage_limit}` : ''}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-3 border-t">
                    <SecondaryButton 
                        onClick={handleClose}
                        className="rounded-lg hover:bg-gray-100 text-sm py-1.5 px-2"
                    >
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton 
                        className="rounded-lg bg-blue-600 hover:bg-blue-700 text-sm py-1.5 px-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
                            <polyline points="17 21 17 13 7 13 7 21"></polyline>
                            <polyline points="7 3 7 8 15 8"></polyline>
                        </svg>
                        Guardar Cambios
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
