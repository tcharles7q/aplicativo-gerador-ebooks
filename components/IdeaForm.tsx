
import React, { useState } from 'react';

interface IdeaFormProps {
    onSubmit: (idea: string) => void;
    isLoading: boolean;
}

const IdeaForm: React.FC<IdeaFormProps> = ({ onSubmit, isLoading }) => {
    const [idea, setIdea] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (idea.trim() && !isLoading) {
            onSubmit(idea.trim());
        }
    };

    return (
        <div className="max-w-2xl mx-auto text-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <h2 className="text-3xl font-bold mb-2">Transforme sua Ideia em um E-book</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
                Digite o tema, o conceito ou a história que você tem em mente, e a nossa IA cuidará do resto, criando um e-book completo com capa, capítulos e ilustrações.
            </p>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={idea}
                    onChange={(e) => setIdea(e.target.value)}
                    placeholder="Ex: Um guia para iniciantes sobre como cuidar de plantas de interior, com dicas práticas e fotos."
                    className="w-full h-40 p-4 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out resize-none"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={!idea.trim() || isLoading}
                    className="mt-6 w-full py-3 px-6 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
                >
                    {isLoading ? 'Gerando...' : 'Criar Meu E-book'}
                </button>
            </form>
        </div>
    );
};

export default IdeaForm;
