import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import MainLayout from '@/layouts/MainLayout';

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <MainLayout title="Perfil">
            <div className="py-10 bg-gray-50">
                <div className="mx-auto max-w-4xl space-y-6 sm:px-6 lg:px-8">
                    <div className="text-center mb-8 py-10 px-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="w-20 h-20 bg-gray-800 rounded-full mx-auto mb-4 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">Mi Cuenta</h1>
                            <div className="flex justify-center mb-3">
                                <div className="h-1 w-24 bg-gray-800 rounded-full"></div>
                            </div>
                            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
                                Gestiona la información de tu perfil y preferencias de seguridad
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 mx-auto max-w-3xl">
                        <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Información Personal</h2>
                        </div>
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className=""
                        />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 mx-auto max-w-3xl">
                        <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Seguridad</h2>
                        </div>
                        <UpdatePasswordForm className="" />
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8 mx-auto max-w-3xl">
                        <div className="flex items-center mb-6 border-b border-gray-200 pb-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mr-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Eliminar Cuenta</h2>
                        </div>
                        <DeleteUserForm className="" />
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
