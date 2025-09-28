
import React from 'react';
import { SpinnerIcon } from './icons';

interface LoadingOverlayProps {
    message: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex flex-col items-center justify-center z-50">
            <div className="text-white text-center">
                <SpinnerIcon className="w-16 h-16 mb-6 animate-spin" />
                <p className="text-xl font-semibold animate-pulse">{message}</p>
            </div>
        </div>
    );
};

export default LoadingOverlay;
