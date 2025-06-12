import { Head, Link } from '@inertiajs/react';
import SectionCarrusel from './Home/SectionCarrusel';
import MainLayout from '@/layouts/MainLayout';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <MainLayout title="Inicio">
            <SectionCarrusel />
            <FloatingWhatsAppIcon />
        </MainLayout>
    );
}

