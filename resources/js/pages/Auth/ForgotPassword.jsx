import InputError from '@/components/InputError';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />
            
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
                        Recupera tu contraseña
                    </h1>
                    
                    <p className="mb-6 text-sm text-gray-600 text-center">
                        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                    </p>

                {status && (
                    <div className="mb-6 text-sm font-medium text-green-600 bg-green-50/90 p-5 rounded-lg border border-green-200 shadow-[0_2px_10px_rgba(0,200,83,0.08)] flex items-center gap-3 animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="flex-1">{status}</span>
                    </div>
                )}

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
                                placeholder="Ingrese su correo electrónico"
                                isFocused={true}
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

                    <div className="mb-6">
                        <PrimaryButton
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent hover:from-transparent hover:via-white/10 hover:to-trasparent focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] relative overflow-hidden justify-center"
                            disabled={processing}
                        >
                            {processing ? "Procesando..." : "Enviar enlace de recuperación"}
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
