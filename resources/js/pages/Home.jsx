import SectionCarrusel from './Home/SectionCarrusel';
import MainLayout from '@/layouts/MainLayout';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';
import Section2 from './Home/Section2';

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <MainLayout title="Inicio">
            <SectionCarrusel />
            <FloatingWhatsAppIcon />
        </MainLayout>
    );
}

