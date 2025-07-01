import PrimaryButton from '@/components/PrimaryButton';
import GuestLayout from '@/layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { EnvelopeIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificación de Correo" />
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
                    Verificación de Correo
                </h1>

                <div className="mb-6 text-sm text-gray-600 bg-gray-50 p-5 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <EnvelopeIcon className="h-6 w-6 text-blue-500" />
                        <span className="font-medium text-gray-800">Confirma tu dirección de correo</span>
                    </div>
                    <p>
                        Gracias por registrarte! Antes de comenzar, ¿podrías verificar tu dirección de correo electrónico haciendo clic en el enlace que acabamos de enviarte? Si no recibiste el correo, con gusto te enviaremos otro.
                    </p>
                </div>

                {status === 'verification-link-sent' && (
                    <div className="mb-6 text-sm font-medium text-green-600 bg-green-50/90 p-5 rounded-lg border border-green-200 shadow-[0_2px_10px_rgba(0,200,83,0.08)] flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico que proporcionaste durante el registro.
                    </div>
                )}

                <form onSubmit={submit}>
                    <div className="flex flex-col gap-4">
                        <PrimaryButton 
                            disabled={processing}
                            className="w-full py-3 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent hover:from-transparent hover:via-white/10 hover:to-trasparent focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-[0_4px_12px_rgba(37,99,235,0.25)] hover:shadow-[0_6px_16px_rgba(37,99,235,0.35)] relative overflow-hidden justify-center"
                        >
                            {processing ? "Procesando..." : "Reenviar Correo de Verificación"}
                        </PrimaryButton>

                        <div className="flex justify-between items-center mt-2">
                            <Link
                                href={route('login')}
                                className="text-sm text-black hover:text-blue-800 flex items-center gap-2 transition-colors p-2 rounded-md hover:bg-blue-50"
                            >
                                <ArrowLeftIcon className="h-4 w-4" />
                                Volver a Iniciar Sesión
                            </Link>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="text-sm text-red-600 hover:text-red-800 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 p-2 rounded-md hover:bg-red-50"
                            >
                                Cerrar Sesión
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        </GuestLayout>
    );
}
