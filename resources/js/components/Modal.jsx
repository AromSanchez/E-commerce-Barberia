import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';

export default function Modal({
    children,
    open = false,
    closeable = true,
    onClose = () => {},
}) {
    return (
        <Dialog
            as={Fragment}
            open={open}
            onClose={closeable ? onClose : () => {}}
        >
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto">
                <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
                
                <Dialog.Panel className="relative z-10 w-full max-w-md p-6 mx-auto my-8 bg-white rounded-lg shadow-xl">
                    {children}
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}
