import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import { useRef } from 'react';

export default function UpdatePasswordForm({ className = '' }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const {
        data,
        setData,
        errors,
        put,
        reset,
        processing,
        recentlySuccessful,
    } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset('password', 'password_confirmation');
                    passwordInput.current.focus();
                }

                if (errors.current_password) {
                    reset('current_password');
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <section className={`${className} mx-auto max-w-3xl`}>
            <header className="bg-black p-5 rounded-lg shadow-md mb-6 text-center">
                <h2 className="text-xl font-bold text-white">
                    Actualizar Contraseña
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                    Asegúrate de que tu cuenta utiliza una contraseña larga y aleatoria para 
                    mantener tu seguridad.
                </p>
            </header>

            <form onSubmit={updatePassword} className="mt-6 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mx-auto">
                <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                    <InputLabel
                        htmlFor="current_password"
                        value="Contraseña Actual"
                        className="text-gray-800 font-semibold"
                    />

                    <TextInput
                        id="current_password"
                        ref={currentPasswordInput}
                        value={data.current_password}
                        onChange={(e) =>
                            setData('current_password', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                        autoComplete="current-password"
                    />

                    <InputError
                        message={errors.current_password}
                        className="mt-2"
                    />
                </div>

                <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                    <InputLabel 
                        htmlFor="password" 
                        value="Nueva Contraseña" 
                        className="text-gray-800 font-semibold"
                    />

                    <TextInput
                        id="password"
                        ref={passwordInput}
                        value={data.password}
                        onChange={(e) => setData('password', e.target.value)}
                        type="password"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                        autoComplete="new-password"
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar Contraseña"
                        className="text-gray-800 font-semibold"
                    />

                    <TextInput
                        id="password_confirmation"
                        value={data.password_confirmation}
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        type="password"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                        autoComplete="new-password"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2"
                    />
                </div>

                <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-300 mt-6">
                    <PrimaryButton 
                        disabled={processing}
                        className="bg-black hover:bg-gray-800 focus:ring-gray-500 px-6 py-2 transition-all duration-300 text-white"
                    >
                        Guardar
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enter="transition ease-in-out duration-500"
                        enterFrom="opacity-0 translate-y-2"
                        enterTo="opacity-100 translate-y-0"
                        leave="transition ease-in-out duration-300"
                        leaveTo="opacity-0"
                    >
                        <p className="text-sm bg-gray-100 text-gray-800 px-4 py-2 rounded-md border border-gray-300">
                            Guardado con éxito
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
