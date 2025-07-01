import React, { useState } from 'react';
import Modal from '@/components/Modal';
import TextInput from '@/components/TextInput';
import InputLabel from '@/components/InputLabel';
import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import SecondaryButton from '@/components/SecondaryButton';
import { useForm } from '@inertiajs/react';

export default function AddCouponDialog({ isOpen, onClose, onAddCoupon }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        code: '',
        type: 'fixed',
        value: '',
        min_amount: '',
        usage_limit: '',
        expires_at: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAddCoupon(data);
    };

    const handleClose = () => {
        reset();
        onClose();
    };

    return (
        <Modal open={isOpen} onClose={handleClose}>
            <form onSubmit={handleSubmit} className="p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Añadir Nuevo Cupón
                </h2>

                <div className="mt-4">
                    <InputLabel htmlFor="code" value="Código" />
                    <TextInput
                        id="code"
                        type="text"
                        name="code"
                        value={data.code}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('code', e.target.value)}
                        required
                    />
                    <InputError message={errors.code} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="type" value="Tipo" />
                    <select
                        id="type"
                        name="type"
                        value={data.type}
                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                        onChange={(e) => setData('type', e.target.value)}
                        required
                    >
                        <option value="fixed">Fijo</option>
                        <option value="percentage">Porcentaje</option>
                    </select>
                    <InputError message={errors.type} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="value" value="Valor" />
                    <TextInput
                        id="value"
                        type="number"
                        name="value"
                        value={data.value}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('value', e.target.value)}
                        step="0.01"
                        required
                    />
                    <InputError message={errors.value} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="min_amount" value="Monto Mínimo (opcional)" />
                    <TextInput
                        id="min_amount"
                        type="number"
                        name="min_amount"
                        value={data.min_amount}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('min_amount', e.target.value)}
                        step="0.01"
                    />
                    <InputError message={errors.min_amount} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="usage_limit" value="Límite de Uso (opcional)" />
                    <TextInput
                        id="usage_limit"
                        type="number"
                        name="usage_limit"
                        value={data.usage_limit}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('usage_limit', e.target.value)}
                    />
                    <InputError message={errors.usage_limit} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="expires_at" value="Fecha de Expiración (opcional)" />
                    <TextInput
                        id="expires_at"
                        type="date"
                        name="expires_at"
                        value={data.expires_at}
                        className="mt-1 block w-full"
                        onChange={(e) => setData('expires_at', e.target.value)}
                    />
                    <InputError message={errors.expires_at} className="mt-2" />
                </div>

                <div className="mt-6 flex justify-end">
                    <SecondaryButton onClick={handleClose}>
                        Cancelar
                    </SecondaryButton>

                    <PrimaryButton className="ms-3" disabled={processing}>
                        Añadir Cupón
                    </PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}