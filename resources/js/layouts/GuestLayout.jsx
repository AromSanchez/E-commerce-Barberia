import ApplicationLogo from '@/components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center overflow-x-hidden bg-white pt-6 sm:justify-center sm:pt-0">            
            <main className="flex-1 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}
