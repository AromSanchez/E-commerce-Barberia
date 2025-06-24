import MainProducts from '@/pages/Tienda/MainProducts';
import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';

export default function Tienda() {
    const { productos, categorias, marcas, mainCategories } = usePage().props;

    return (
        <MainLayout title="Tienda">
            <MainProducts productos={productos} categorias={categorias} marcas={marcas} mainCategories={mainCategories} />
            <FloatingWhatsAppIcon />
        </MainLayout >
    );
}