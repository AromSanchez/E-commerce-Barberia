import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import { Transition } from '@headlessui/react';
import { Link, useForm, usePage } from '@inertiajs/react';

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = '',
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            last_name: user.last_name,
            phone_number: user.phone_number,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();

        patch(route('profile.update'));
    };

    return (
        <section className={`${className} mx-auto max-w-3xl`}>
            <header className="bg-black p-5 rounded-lg shadow-md mb-6 text-center">
                <h2 className="text-xl font-bold text-white">
                    Información del Perfil
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                    Actualiza la información de tu cuenta y dirección de correo electrónico.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6 bg-white p-6 rounded-lg shadow-sm border border-gray-200 mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                        <InputLabel htmlFor="name" value="Nombre" className="text-gray-800 font-semibold" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                        <InputLabel htmlFor="last_name" value="Apellido" className="text-gray-800 font-semibold" />

                        <TextInput
                            id="last_name"
                            className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                            value={data.last_name}
                            onChange={(e) => setData('last_name', e.target.value)}
                            required
                            autoComplete="family-name"
                        />

                        <InputError className="mt-2" message={errors.last_name} />
                    </div>
                </div>

                <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                    <InputLabel htmlFor="phone_number" value="Número de Teléfono" className="text-gray-800 font-semibold" />

                    <TextInput
                        id="phone_number"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                        value={parseInt(data.phone_number, 10)}
                        onChange={(e) => setData('phone_number', parseInt(e.target.value, 10))}
                        required
                        autoComplete="tel"
                    />

                    <InputError className="mt-2" message={errors.phone_number} />
                </div>

                <div className="transition-all duration-300 ease-in-out hover:shadow-md p-4 rounded-lg bg-gray-50">
                    <InputLabel htmlFor="email" value="Email" className="text-gray-800 font-semibold" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                {mustVerifyEmail && user.email_verified_at === null && (
                    <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg mt-4">
                        <p className="text-sm text-gray-800 flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="font-medium">Tu dirección de correo no está verificada.</span>
                            <Link
                                href={route('verification.send')}
                                method="post"
                                as="button"
                                className="rounded-md text-sm text-black underline hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                            >
                                Haz clic aquí para reenviar el correo de verificación.
                            </Link>
                        </p>

                        {status === 'verification-link-sent' && (
                            <div className="mt-2 text-sm font-medium text-gray-800 bg-white p-2 rounded-md border border-gray-300">
                                Un nuevo enlace de verificación ha sido enviado a tu
                                dirección de correo electrónico.
                            </div>
                        )}
                    </div>
                )}

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
