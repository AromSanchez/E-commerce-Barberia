import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
// Importando iconos de React - Heroicons v2
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, UserIcon, PhoneIcon } from '@heroicons/react/24/outline';

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
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
    // Detectar cambios en el ancho de la ventana para adaptarse responsivamente
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
      
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="flex min-h-screen flex-1 bg-gradient-to-br from-gray-50 via-white to-gray-100">
            <Head title="Crear Cuenta" />
            
            {/* Imagen lateral con efectos mejorados - solo visible en pantallas grandes (lg) */}
            <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
                {/* Imagen principal con máscara mejorada */}
                <div 
                    style={{ backgroundImage: `url('/images/loginbann.png')` }}
                    className="absolute inset-0 bg-cover bg-center h-full"
                ></div>
            </div>

            {/* Sección del formulario con diseño mejorado */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-y-auto">
                {/* Elementos decorativos de fondo */}
                <div className="absolute inset-0 overflow-hidden lg:hidden">
                    <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full blur-3xl opacity-30"></div>
                    <div className="absolute bottom-20 left-10 w-40 h-40 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full blur-3xl opacity-20"></div>
                </div>

                <div className="w-full max-w-md relative my-auto">
                    {/* Tarjeta principal con efectos glassmorphism */}
                    <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-5 relative overflow-hidden">
                        {/* Efectos de brillo en la tarjeta */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-100/20 to-transparent rounded-full blur-3xl"></div>
                        
                        {/* Logo con animación sutil */}
                        <div className="flex justify-center mb-4">
                            <div className="relative group">
                                <img 
                                    src="/images/logo.png" 
                                    alt="BarberShop" 
                                    className="h-12 transition-transform duration-300 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-r from-gray-400/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </div>
                        </div>

                        {/* Títulos con mejor tipografía */}
                        <div className="text-center mb-4">
                            <h1 className="text-2xl font-bold mb-1 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                                Crea tu cuenta
                            </h1>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Ingresa tus datos para registrarte
                            </p>
                        </div>

                        <form onSubmit={submit} className="space-y-3">
                            {/* Primera fila: Nombre y Apellido */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="group">
                                    <InputLabel htmlFor="name" value="Nombres" className="text-gray-700 font-medium mb-1 text-sm" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                            <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                        </div>
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="pl-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        {/* Efecto de brillo en focus */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div className="group">
                                    <InputLabel htmlFor="last_name" value="Apellidos" className="text-gray-700 font-medium mb-1 text-sm" />
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                            <UserIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                        </div>
                                        <TextInput
                                            id="last_name"
                                            name="last_name"
                                            value={data.last_name}
                                            className="pl-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                            autoComplete="family-name"
                                            onChange={(e) => setData('last_name', e.target.value)}
                                            required
                                        />
                                        {/* Efecto de brillo en focus */}
                                        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                    </div>
                                    <InputError message={errors.last_name} className="mt-2" />
                                </div>
                            </div>

                            {/* Email */}
                            <div className="group">
                                <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-medium mb-1 text-sm" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="pl-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        required
                                    />
                                    {/* Efecto de brillo en focus */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Teléfono */}
                            <div className="group">
                                <InputLabel htmlFor="phone_number" value="Número Telefónico" className="text-gray-700 font-medium mb-1 text-sm" />
                                <div className="relative">
                                    <div className="flex">
                                        <div className="flex items-center justify-center bg-gray-100 px-3 rounded-l-xl border border-gray-200 text-sm">
                                            +51
                                        </div>
                                        <div className="relative flex-grow">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                                                <PhoneIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
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
                                                className="pl-10 mt-0 block w-full rounded-l-none rounded-r-xl border-gray-200 shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                                autoComplete="tel"
                                                required
                                            />
                                        </div>
                                    </div>
                                    {/* Efecto de brillo en focus */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                <InputError message={errors.phone_number} className="mt-2" />
                            </div>

                            {/* Contraseña */}
                            <div className="group">
                                <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-medium mb-1 text-sm" />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={data.password}
                                        className="pl-12 pr-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 z-10 transition-colors duration-200"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                    {/* Efecto de brillo en focus */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            {/* Confirmar Contraseña */}
                            <div className="group">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirmar Contraseña"
                                    className="text-gray-700 font-medium mb-1 text-sm"
                                />
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                                        <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                                    </div>
                                    <TextInput
                                        id="password_confirmation"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="pl-12 pr-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white h-9"
                                        placeholder="********"
                                        autoComplete="new-password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-500 hover:text-gray-700 z-10 transition-colors duration-200"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
                                            <EyeSlashIcon className="h-5 w-5" />
                                        ) : (
                                            <EyeIcon className="h-5 w-5" />
                                        )}
                                    </button>
                                    {/* Efecto de brillo en focus */}
                                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                                </div>
                                <InputError message={errors.password_confirmation} className="mt-2" />
                            </div>

                            {/* Términos y Condiciones */}
                            <div className="py-0">
                                <label className="flex items-center group cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="rounded border-gray-300 text-gray-700 shadow-sm focus:ring-gray-500" 
                                        required 
                                    />
                                    <span className="ml-3 text-xs text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                                        Acepto los términos y condiciones
                                    </span>
                                </label>
                            </div>

                            {/* Botón principal con efectos mejorados */}
                            <div className="pt-1">
                                <PrimaryButton
                                    className="w-full py-2 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group"
                                    disabled={processing}
                                >
                                    {/* Efecto de brillo al hover */}
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-all duration-1000"></div>
                                    <span className="relative text-center w-full font-semibold">
                                        {processing ? "Procesando..." : "Crear Cuenta"}
                                    </span>
                                </PrimaryButton>
                            </div>

                            {/* Login Link mejorado */}
                            <div className="mt-4 text-center text-sm text-gray-600">
                                ¿Ya tienes una cuenta?{' '}
                                <Link 
                                    href={route('login')} 
                                    className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}