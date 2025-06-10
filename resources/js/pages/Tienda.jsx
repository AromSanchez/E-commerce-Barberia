import MainProducts from '@/pages/Tienda/MainProducts';
import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

export default function Tienda() {
    const { productos, categorias, marcas} = usePage().props;

    return (
        <MainLayout title="Tienda">
            <MainProducts productos={productos} categorias={categorias} marcas={marcas} />
        </MainLayout >
    );
}