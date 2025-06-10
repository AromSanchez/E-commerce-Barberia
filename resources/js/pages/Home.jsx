import { Head, Link } from '@inertiajs/react';
import SectionCarrusel from './Home/SectionCarrusel';
import MainLayout from '@/layouts/MainLayout';

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <MainLayout title="Inicio">
            <SectionCarrusel />
        </MainLayout>
    );
}

