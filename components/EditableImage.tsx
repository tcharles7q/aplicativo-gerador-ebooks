
import React from 'react';
import { SpinnerIcon, RefreshIcon } from './icons';

interface EditableImageProps {
    src: string;
    alt: string;
    onRegenerate: () => void;
}

const EditableImage: React.FC<EditableImageProps> = ({ src, alt, onRegenerate }) => {
    const isLoading = src === 'loading';

    return (
        <div className="relative group w-full h-full bg-gray-200 dark:bg-gray-700">
            {isLoading ? (
                <div className="w-full h-full flex items-center justify-center">
                    <SpinnerIcon className="w-12 h-12 text-gray-500 animate-spin" />
                </div>
            ) : (
                <img src={src} alt={alt} className="w-full h-full object-cover" />
            )}
            
            {!isLoading && (
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button 
                        onClick={onRegenerate}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white text-gray-800 font-semibold py-2 px-4 rounded-full shadow-lg flex items-center gap-2"
                    >
                        <RefreshIcon className="w-5 h-5" />
                        Gerar outra imagem
                    </button>
                </div>
            )}
        </div>
    );
};

export default EditableImage;
