import DangerButton from '@/components/DangerButton';
import InputError from '@/components/InputError';
import InputLabel from '@/components/InputLabel';
import Modal from '@/components/Modal';
import SecondaryButton from '@/components/SecondaryButton';
import TextInput from '@/components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className} mx-auto max-w-3xl`}>
            <header className="bg-black p-5 rounded-lg shadow-md mb-6 text-center">
                <h2 className="text-xl font-bold text-white">
                    Eliminar Cuenta
                </h2>

                <p className="mt-1 text-sm text-gray-300">
                    Una vez que tu cuenta sea eliminada, todos sus recursos y datos
                    serán eliminados permanentemente.
                </p>
            </header>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <p className="mb-4 text-gray-800">Esta acción no se puede deshacer. Por favor, procede con precaución.</p>
                <DangerButton 
                    onClick={confirmUserDeletion}
                    className="bg-black hover:bg-gray-800 focus:ring-gray-500 px-6 py-2 transition-all duration-300 border border-gray-300"
                >
                    Eliminar Cuenta
                </DangerButton>
            </div>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 bg-white border-t-4 border-black">
                    <h2 className="text-lg font-bold text-gray-900">
                        ¿Estás seguro de que quieres eliminar tu cuenta?
                    </h2>

                    <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-200">
                        Una vez que tu cuenta sea eliminada, todos sus recursos y
                        datos serán eliminados permanentemente. Por favor, introduce tu
                        contraseña para confirmar que deseas eliminar permanentemente
                        tu cuenta.
                    </p>

                    <div className="mt-6 transition-all duration-300 ease-in-out p-4 rounded-lg bg-gray-50 border border-gray-200">
                        <InputLabel
                            htmlFor="password"
                            value="Contraseña"
                            className="text-gray-800 font-semibold mb-2"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-full border-gray-300 focus:border-black focus:ring focus:ring-gray-300 focus:ring-opacity-50 rounded-md shadow-sm bg-white text-gray-900"
                            isFocused
                            placeholder="Introduce tu contraseña para confirmar"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-center gap-4 pt-4 border-t border-gray-300">
                        <SecondaryButton 
                            onClick={closeModal}
                            className="px-6 py-2 bg-white hover:bg-gray-100 border border-gray-300 text-gray-800 transition-all duration-300 focus:ring-gray-400"
                        >
                            Cancelar
                        </SecondaryButton>

                        <DangerButton 
                            className="ms-3 px-6 py-2 bg-black hover:bg-gray-800 text-white border-none transition-all duration-300 shadow-sm" 
                            disabled={processing}
                        >
                            Eliminar Cuenta
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}
