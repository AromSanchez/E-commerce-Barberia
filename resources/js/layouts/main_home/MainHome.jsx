import React from 'react';

const MainHome = () => {
    return (
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-900 to-black text-white p-8">
            <div className="max-w-lg">
                <h2 className="text-lg font-light">Para tu elegancia</h2>
                <h1 className="text-5xl font-bold">Kit Barber <span className="text-indigo-500">Pro</span></h1>
                <p className="mt-4 text-sm">Creado para el mejor cuidado para todos.</p>
                <button className="mt-6 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold rounded">Compra ahora</button>
            </div>
            <div className="flex-shrink-0">
                {/* Aquí puedes colocar la imagen */}
            </div>
        </div>
    );
};

export default MainHome;