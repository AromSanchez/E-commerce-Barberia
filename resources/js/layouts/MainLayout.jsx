import { Head } from '@inertiajs/react';
import Header from '@/components/Cliente/Header';
import Footer from '@/components/Cliente/Footer';

export default function MainLayout({ children, title }) {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </Head>
      <Header />
      <main className="flex-1 overflow-x-hidden">
          {children}
      </main>
      <Footer />
    </div>
  );
}