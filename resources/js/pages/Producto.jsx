import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';
import MainProduct from './Producto/MainProduct';
import FloatingWhatsAppIcon from '@/components/Cliente/IconWhatssap';

export default function ProductShow() {
  const { product, relatedProducts } = usePage().props;

  return (
    <MainLayout title={product.name}>
      <MainProduct product={product} relatedProducts={relatedProducts} />
      <FloatingWhatsAppIcon />
    </MainLayout>
  );
}