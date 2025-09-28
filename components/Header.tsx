
import React from 'react';

const BookIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 2H5C3.9 2 3 2.9 3 4V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V4C21 2.9 20.1 2 19 2ZM19 20H5V4H7V12L9.5 10.5L12 12V4H19V20Z" />
    </svg>
);


const Header: React.FC = () => {
    return (
        <header className="bg-white dark:bg-gray-800 shadow-md">
            <div className="container mx-auto px-4 py-4 flex items-center justify-center">
                <BookIcon className="w-8 h-8 text-indigo-500 mr-3" />
                <h1 className="text-2xl font-bold text-gray-800 dark:text-white tracking-tight">
                    Gerador de E-books com IA
                </h1>
            </div>
        </header>
    );
};

export default Header;
