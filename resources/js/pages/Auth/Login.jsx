import Checkbox from '@/components/Checkbox';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import PrimaryButton from '@/components/PrimaryButton';
import TextInput from '@/components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import React, { useState, useEffect } from 'react';
// Importando iconos de React - Heroicons v2
import { EnvelopeIcon, LockClosedIcon, EyeIcon, EyeSlashIcon, SparklesIcon } from '@heroicons/react/24/outline';

export default function Login({ status, canResetPassword }) {
  const { data, setData, post, processing, errors, reset } = useForm({
    email: '',
    password: '',
    remember: false,
  });

  const submit = (e) => {
    e.preventDefault();
    post(route('login'), { onFinish: () => reset('password') });
  };

  const [showPassword, setShowPassword] = useState(false);
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
  
  return (
    <div className="flex h-screen flex-1 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100">

      {/* Imagen lateral con efectos mejorados - solo visible en pantallas grandes (lg) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center overflow-hidden">
        
        {/* Imagen principal con máscara mejorada */}
        <div 
          className="absolute inset-0 bg-[url('/images/loginbann.png')] bg-cover bg-center"
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
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-6 relative overflow-hidden">
            {/* Efectos de brillo en la tarjeta */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-gray-400 to-transparent"></div>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-gray-100/20 to-transparent rounded-full blur-3xl"></div>
            
            <Head title="Iniciar Sesión" />

            {/* Logo con animación sutil */}
            <div className="flex justify-center mb-6">
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
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
                Bienvenido
              </h1>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ingresa tus credenciales para acceder a tu cuenta
              </p>
            </div>

            {status && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl">
                <div className="text-sm font-medium text-green-800">{status}</div>
              </div>
            )}

            <form onSubmit={submit} className="space-y-4">
              {/* Campo de email mejorado */}
              <div className="group">
                <InputLabel htmlFor="email" value="Correo Electrónico" className="text-gray-700 font-medium mb-2" />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                  </div>
                  <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="pl-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white"
                    placeholder="correo@ejemplo.com"
                    autoComplete="username"
                    isFocused
                    onChange={(e) => setData('email', e.target.value)}
                  />
                  {/* Efecto de brillo en focus */}
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-gray-200/20 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </div>
                <InputError message={errors.email} className="mt-2" />
              </div>

              {/* Campo de contraseña mejorado */}
              <div className="group">
                <InputLabel htmlFor="password" value="Contraseña" className="text-gray-700 font-medium mb-2" />
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                    <LockClosedIcon className="h-5 w-5 text-gray-400 group-focus-within:text-gray-600 transition-colors duration-200" />
                  </div>
                  <TextInput
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={data.password}
                    className="pl-12 pr-12 mt-1 block w-full border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent bg-gray-50/50 backdrop-blur-sm transition-all duration-300 hover:bg-white focus:bg-white"
                    placeholder="********"
                    autoComplete="current-password"
                    onChange={(e) => setData('password', e.target.value)}
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

              {/* Recordarme y olvidé contraseña */}
              <div className="flex justify-between items-center py-1">
                <label className="flex items-center group cursor-pointer">
                  <Checkbox
                    name="remember"
                    checked={data.remember}
                    onChange={(e) => setData('remember', e.target.checked)}
                    className="rounded focus:ring-gray-500"
                  />
                  <span className="ml-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                    Recordarme
                  </span>
                </label>

                {canResetPassword && (
                  <Link 
                    href={route('password.request')} 
                    className="text-sm text-gray-700 hover:text-gray-900 transition-colors duration-200 font-medium relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full"
                  >
                    ¿Olvidaste la contraseña?
                  </Link>
                )}
              </div>

              {/* Botón principal con efectos mejorados */}
              <div className="pt-1">
                <PrimaryButton
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 hover:from-gray-800 hover:via-gray-700 hover:to-gray-800 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl relative overflow-hidden group"
                  disabled={processing}
                >
                  {/* Efecto de brillo al hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                  <span className="relative text-center w-full font-semibold">
                    {processing ? "Procesando..." : "Iniciar Sesión"}
                  </span>
                </PrimaryButton>
              </div>

              {/* Separador elegante */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/80 text-gray-500 font-medium backdrop-blur-sm rounded-full">
                    O CONTINÚA CON
                  </span>
                </div>
              </div>

              {/* Botón de Google mejorado */}
              <button
                type="button"
                className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 px-6 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md group relative overflow-hidden"
                onClick={() => (window.location.href = '/auth/google/redirect')}
              >
                {/* Efecto de brillo sutil */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="relative z-10">
                  <path d="M18.1711 8.36788H17.4998H16.6665H9.99984V11.6346H14.7094C14.0225 13.4612 12.1998 14.7498 9.99984 14.7498C7.23859 14.7498 5.00001 12.5112 5.00001 9.74992C5.00001 6.98867 7.23859 4.75008 9.99984 4.75008C11.1706 4.75008 12.2512 5.14924 13.1041 5.81825L15.4069 3.51534C13.9426 2.14258 12.0537 1.33325 9.99984 1.33325C5.39797 1.33325 1.66667 5.06455 1.66667 9.66642C1.66667 14.2683 5.39797 17.9996 9.99984 17.9996C14.6017 17.9996 18.3332 14.2683 18.3332 9.66642C18.3332 9.22396 18.2761 8.78929 18.1711 8.36788Z" fill="#FFC107"/>
                  <path d="M2.62744 5.92771L5.2443 7.82138C5.97088 6.02259 7.83567 4.75 9.99992 4.75C11.1707 4.75 12.2513 5.14917 13.1041 5.81817L15.4069 3.51526C13.9426 2.1425 12.0537 1.33317 9.99992 1.33317C6.74993 1.33317 3.92744 3.1957 2.62744 5.92771Z" fill="#FF3D00"/>
                  <path d="M10.0001 17.9999C12.0001 17.9999 13.8459 17.2341 15.2952 15.9332L12.7587 13.7874C11.9074 14.4163 10.9533 14.7499 10.0001 14.7499C7.81352 14.7499 5.99769 13.4766 5.30435 11.6666L2.63269 13.7332C3.91769 16.3916 6.76644 17.9999 10.0001 17.9999Z" fill="#4CAF50"/>
                  <path d="M18.1711 8.36825H17.4998H16.6665H10.0002V11.6349H14.7098C14.3869 12.5027 13.7951 13.2571 13.0363 13.7904L13.0385 13.7889L15.5749 15.9347C15.4069 16.0897 18.3335 13.9997 18.3335 9.66659C18.3335 9.22413 18.2765 8.78946 18.1711 8.36825Z" fill="#1976D2"/>
                </svg>
                <span className="relative z-10">Continuar con Google</span>
              </button>

              {/* Link de registro mejorado */}
              <div className="mt-8 text-center text-sm text-gray-600">
                ¿No tienes una cuenta?{' '}
                <Link 
                  href={route('register')} 
                  className="text-gray-900 font-semibold hover:text-gray-700 transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gray-900 after:transition-all after:duration-300 hover:after:w-full"
                >
                  Regístrate aquí
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}