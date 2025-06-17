import MainLayout from "@/layouts/MainLayout";
import ProductsOfertas from "./Ofertas/ProductsOfertas";
import { usePage } from "@inertiajs/react";
import CarruBanner from "./Ofertas/CarruBanner";

export default function Ofertas() {
    const { productos } = usePage().props;
    return (
        <MainLayout title="Ofertas">
            <CarruBanner />
            <ProductsOfertas productos={productos} />
        </MainLayout>
    );
}