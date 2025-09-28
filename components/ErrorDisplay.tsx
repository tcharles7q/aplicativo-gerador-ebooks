
import React from 'react';

interface ErrorDisplayProps {
    message: string;
    onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
    return (
        <div className="max-w-xl mx-auto text-center p-8 bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-700 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-3">Ops! Algo deu errado.</h2>
            <p className="text-red-600 dark:text-red-400 mb-6">
                {message}
            </p>
            <button
                onClick={onRetry}
                className="py-2 px-6 bg-red-600 text-white font-semibold rounded-md shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-transform transform hover:scale-105"
            >
                Tentar Novamente
            </button>
        </div>
    );
};

export default ErrorDisplay;
