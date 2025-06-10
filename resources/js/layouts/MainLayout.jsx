import { Head } from '@inertiajs/react';
import Header from '@/components/Cliente/Header';
import Footer from '@/components/Cliente/Footer';

export default function MainLayout({ children, title }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Head title={title} />
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}