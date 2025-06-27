import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function ResetPassword({ token, email }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Restablecer Contraseña" />
            
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.15)] border border-gray-100 p-8 relative overflow-hidden max-w-md w-full mx-auto">
                    {/* Efectos de brillo en la tarjeta */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-blue-50/30 to-transparent rounded-full blur-3xl"></div>

                    <div className="flex justify-center mb-8">
                        <div className="relative group">
                            <div className="absolute inset-0 bg-gray-200 rounded-full blur-md opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                            <img 
                                src="/images/logo.png" 
                                alt="BarberShop" 
                                className="h-16 relative z-10 transition-transform duration-300 group-hover:scale-110" 
                            />
                        </div>
                    </div>

                    <h1 className="text-2xl font-bold mb-6 bg-black bg-clip-text text-transparent text-center">
                        Restablece tu contraseña
                    </h1>
                    
                    <p className="mb-6 text-sm text-gray-600 text-center">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>

                    <form className="space-y-5" onSubmit={submit}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-800 mb-1">
                            Correo Electrónico
                        </label>
                        <div className="relative">
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 pl-10 focus:border-blue-400 focus:ring-blue-300"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>
                        <InputError message={errors.email} className="mt-2 text-xs" />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-800 mb-1">
                            Nueva Contraseña
                        </label>
                        <div className="relative">
                            <TextInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                placeholder="••••••••••••"
                                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 pl-10 pr-10 focus:border-blue-400 focus:ring-blue-300"
                                autoComplete="new-password"
                                isFocused={true}
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-800 mb-1">
                            Confirmar Contraseña
                        </label>
                        <div className="relative">
                            <TextInput
                                id="password_confirmation"
                                type={showConfirmPassword ? "text" : "password"}
                                name="password_confirmation"
                                value={data.password_confirmation}
                                placeholder="••••••••••••"
                                className="block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 pl-10 pr-10 focus:border-blue-400 focus:ring-blue-300"
                                autoComplete="new-password"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
                            >
                                {showConfirmPassword ? (
                                    <EyeSlashIcon className="h-5 w-5" />
                                ) : (
                                    <EyeIcon className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        <InputError message={errors.password_confirmation} className="mt-2 text-xs" />
                    </div>

                    <div className="mb-6">
                        <PrimaryButton
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent hover:from-transparent hover:via-white/10 hover:to-trasparent focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] relative overflow-hidden justify-center"
                            disabled={processing}
                        >
                            {processing ? "Procesando..." : "Restablecer Contraseña"}
                        </PrimaryButton>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <Link
                            href={route('login')}
                            className="text-sm text-black hover:text-gray-600 flex items-center gap-2 transition-colors p-2 rounded-md hover:bg-gray-50"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                stroke="currentColor"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18" 
                                />
                            </svg>
                            Volver a iniciar sesión
                        </Link>
                    </div>
                </form>
            </div>
        </div>
        </GuestLayout>
    );
}
