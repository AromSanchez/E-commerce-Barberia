import Header from '@/layouts/header/Header';
import Footer from '@/layouts/footer/Footer';
import MainProducts from '@/components/MainProducts/MainProducts';
import { usePage } from '@inertiajs/react';


export default function Products() {
    const { productos, categorias } = usePage().props;

    return (
        <>
            <Header />
            <MainProducts productos={productos} categorias={categorias} />
            <Footer />
        </>
    );
}