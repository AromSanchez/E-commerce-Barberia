import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        last_name: '',
        phone_number: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex h-screen">
            {/* Sección izquierda con imagen y texto */}
            <div className="hidden md:flex md:w-1/2 bg-gray-900 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70 z-10"></div>
                <img src="/images/logoinicio.png" alt="" className="object-cover w-full h-full" />
            </div>

            {/* Sección derecha con formulario */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 overflow-y-auto">
                <div className="w-full max-w-md">
                    <div className="flex justify-end mb-4">
                        <img src="/images/logo.png" alt="Barber Logo" className="h-8" />
                    </div>
                    
                    <h2 className="text-2xl font-bold mb-1">Crea tu cuenta</h2>
                    <p className="text-gray-600 text-sm mb-4">Ingresa tus datos para registrarte</p>

                    <form onSubmit={submit} className="space-y-3">
                        <div className="grid grid-cols-2 gap-3">
                            {/* Primera fila: Nombre y Apellido */}
                            <div>
                                <InputLabel htmlFor="name" value="Nombres" className="text-sm" />
                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full py-1"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                    placeholder="John"
                                />
                                <InputError message={errors.name} className="mt-1 text-xs" />
                            </div>

                            <div>
                                <InputLabel htmlFor="last_name" value="Apellidos" className="text-sm" />
                                <TextInput
                                    id="last_name"
                                    name="last_name"
                                    value={data.last_name}
                                    className="mt-1 block w-full py-1"
                                    autoComplete="family-name"
                                    onChange={(e) => setData('last_name', e.target.value)}
                                    required
                                    placeholder="Perez"
                                />
                                <InputError message={errors.last_name} className="mt-1 text-xs" />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <InputLabel htmlFor="email" value="Correo Electrónico" className="text-sm" />
                            <TextInput
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="mt-1 block w-full py-1"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                                required
                                placeholder="john.doe@gmail.com"
                            />
                            <InputError message={errors.email} className="mt-1 text-xs" />
                        </div>

                        {/* Teléfono */}
                        <div>
                            <InputLabel htmlFor="phone_number" value="Número Telefónico" className="text-sm" />
                            <div className="flex">
                                <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-md border border-gray-300 text-sm">
                                    +51
                                </div>
                                <TextInput
                                    id="phone_number"
                                    name="phone_number"
                                    value={data.phone_number}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d*$/.test(value)) {
                                            setData('phone_number', value);
                                        }
                                    }}
                                    className="mt-0 block w-full rounded-l-none py-1"
                                    autoComplete="tel"
                                    required
                                />
                            </div>
                            <InputError message={errors.phone_number} className="mt-1 text-xs" />
                        </div>

                        {/* Contraseña */}
                        <div>
                            <InputLabel htmlFor="password" value="Contraseña" className="text-sm" />
                            <div className="relative">
                                <TextInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full pr-10 py-1"
                                    placeholder="Ingresa tu contraseña"
                                    autoComplete="new-password"
                                    onChange={(e) => setData('password', e.target.value)}
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {showPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        )}
                                        {!showPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                    </svg>
                                </button>
                            </div>
                            <InputError message={errors.password} className="mt-1 text-xs" />
                        </div>

                        {/* Confirmar Contraseña */}
                        <div>
                            <InputLabel
                                htmlFor="password_confirmation"
                                value="Confirmar Contraseña"
                                className="text-sm"
                            />
                            <div className="relative">
                                <TextInput
                                    id="password_confirmation"
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full pr-10 py-1"
                                    placeholder="Confirma tu contraseña"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData('password_confirmation', e.target.value)
                                    }
                                    required
                                />
                                <button 
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        {showConfirmPassword ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        )}
                                        {!showConfirmPassword && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />}
                                    </svg>
                                </button>
                            </div>
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-1 text-xs"
                            />
                        </div>

                        {/* Términos y Condiciones */}
                        <div className="mt-2">
                            <label className="flex items-center">
                                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" required />
                                <span className="ml-2 text-xs text-gray-600">Acepto los términos y Condiciones</span>
                            </label>
                        </div>

                        {/* Botón de Registro */}
                        <div className="mt-3">
                            <PrimaryButton className="w-full justify-center py-2" disabled={processing}>
                                Crear Cuenta
                            </PrimaryButton>
                        </div>

                        {/* Separador */}
                        <div className="mt-3 text-center">
                            <p className="text-xs text-gray-500">O REGÍSTRATE CON</p>
                        </div>

                        {/* Botón de Google */}
                        <div>
                            <button type="button" className="w-full border border-gray-300 rounded-md py-2 flex items-center justify-center">
                                <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FFC107"/>
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#FF3D00"/>
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#4CAF50"/>
                                    <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" fill="#1976D2"/>
                                </svg>
                                <span className="text-sm">Google</span>
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="mt-3 text-center">
                            <p className="text-xs text-gray-600">
                                ¿Ya tienes una cuenta? 
                                <Link
                                    href={route('login')}
                                    className="ml-1 font-medium text-red-600 hover:text-red-500"
                                >
                                    Inicia Sesión
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}