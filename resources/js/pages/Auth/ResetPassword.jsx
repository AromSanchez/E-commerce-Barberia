import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
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
            
            <div className="w-full max-w-md space-y-8 mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        Restablece tu contraseña
                    </h1>
                    <p className="mt-2 text-sm text-gray-600">
                        Ingresa tu nueva contraseña para recuperar el acceso a tu cuenta.
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Correo Electrónico
                        </label>
                        <TextInput
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                            autoComplete="username"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        <InputError message={errors.email} className="mt-2 text-xs" />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                            Nueva Contraseña
                        </label>
                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                            autoComplete="new-password"
                            isFocused={true}
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        <InputError message={errors.password} className="mt-2 text-xs" />
                    </div>

                    <div>
                        <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">
                            Confirmar Contraseña
                        </label>
                        <TextInput
                            id="password_confirmation"
                            type="password"
                            name="password_confirmation"
                            value={data.password_confirmation}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
                            autoComplete="new-password"
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                        />
                        <InputError message={errors.password_confirmation} className="mt-2 text-xs" />
                    </div>

                    <div>
                        <PrimaryButton
                            className="w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                            disabled={processing}
                        >
                            Restablecer Contraseña
                        </PrimaryButton>
                    </div>
                    
                    <div className="flex items-center justify-center">
                        <Link
                            href={route('login')}
                            className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                        >
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4 mr-1" 
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
        </GuestLayout>
    );
}
