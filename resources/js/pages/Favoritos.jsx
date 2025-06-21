import MainFavoritos from '@/pages/Favoritos/MainFavoritos';
import { usePage } from '@inertiajs/react';
import MainLayout from '@/layouts/MainLayout';

export default function Favoritos() {
  const { favorites } = usePage().props;

  return (
    <MainLayout title="Favoritos">
      <MainFavoritos favorites={favorites} />
    </MainLayout>
  );
}