import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';

export default function ProductShow() {
  const { product } = usePage().props;

  return (
    <MainLayout title={product.name}>

      <FloatingWhatsAppIcon />
    </MainLayout>
  );
}