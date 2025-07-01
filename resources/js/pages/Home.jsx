import SectionCarrusel from './Home/SectionCarrusel';
import MainLayout from '@/layouts/MainLayout';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';
import Section2 from './Home/Section2';
import IconChatBot from '@/components/Cliente/IconChatBot';
import Destaca from './Home/Destaca';
import Boletin from '@/components/Cliente/Boletin';

export default function Home({ auth, laravelVersion, phpVersion }) {
    return (
        <MainLayout title="Inicio">
            <SectionCarrusel />
            <Section2 />
            <IconChatBot />
            <Destaca />
            <Boletin />
            <FloatingWhatsAppIcon />
        </MainLayout>
    );
}

