import MainLayout from "@/layouts/MainLayout";

export default function Ofertas() {
    return (
        <MainLayout title="Ofertas">
            <div className="flex flex-col items-center justify-center h-screen">
                <h1 className="text-4xl font-bold mb-4">Ofertas</h1>
                <p className="text-lg">¡Pronto estarán disponibles las ofertas!</p>
            </div>
        </MainLayout>
    );
}