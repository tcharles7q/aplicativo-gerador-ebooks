
import React, { useState, useCallback } from 'react';
import { Ebook, Chapter } from './types';
import { generateEbookStructure, generateChapterContent, generateImage } from './services/geminiService';
import Header from './components/Header';
import IdeaForm from './components/IdeaForm';
import LoadingOverlay from './components/LoadingOverlay';
import EbookViewer from './components/EbookViewer';
import ErrorDisplay from './components/ErrorDisplay';

type AppState = 'form' | 'loading' | 'ebook' | 'error';

const App: React.FC = () => {
    const [appState, setAppState] = useState<AppState>('form');
    const [loadingMessage, setLoadingMessage] = useState<string>('');
    const [ebook, setEbook] = useState<Ebook | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleCreateEbook = useCallback(async (idea: string) => {
        setAppState('loading');
        setError(null);

        try {
            setLoadingMessage('Analisando sua ideia e criando a estrutura...');
            const structure = await generateEbookStructure(idea);

            setLoadingMessage('Criando um título criativo...');
            // The title is already in structure, just updating message for effect
            await new Promise(res => setTimeout(res, 1000)); 
            
            setLoadingMessage('Gerando a imagem da capa...');
            const coverImageUrl = await generateImage(structure.coverImagePrompt, '3:4');

            const chapters: Chapter[] = [];
            for (let i = 0; i < structure.chapters.length; i++) {
                const chapterStructure = structure.chapters[i];
                setLoadingMessage(`Escrevendo o capítulo ${i + 1}: ${chapterStructure.title}...`);
                const content = await generateChapterContent(chapterStructure.contentPrompt);

                setLoadingMessage(`Criando ilustração para o capítulo ${i + 1}...`);
                const imageUrl = await generateImage(chapterStructure.imagePrompt, '4:3');

                chapters.push({
                    id: `chapter-${i}-${Date.now()}`,
                    title: chapterStructure.title,
                    content,
                    imageUrl,
                    imagePrompt: chapterStructure.imagePrompt,
                });
            }

            setEbook({
                title: structure.title,
                coverImageUrl,
                coverImagePrompt: structure.coverImagePrompt,
                chapters,
            });
            setAppState('ebook');
        } catch (err) {
            console.error(err);
            setError(err instanceof Error ? err.message : 'Ocorreu um erro desconhecido ao gerar o e-book.');
            setAppState('error');
        }
    }, []);
    
    const handleUpdateEbook = useCallback((updatedEbook: Ebook) => {
        setEbook(updatedEbook);
    }, []);

    const handleReset = () => {
        setAppState('form');
        setEbook(null);
        setError(null);
    };

    const renderContent = () => {
        switch (appState) {
            case 'loading':
                return <LoadingOverlay message={loadingMessage} />;
            case 'ebook':
                return ebook && <EbookViewer ebook={ebook} setEbook={handleUpdateEbook} onReset={handleReset} />;
            case 'error':
                 return <ErrorDisplay message={error || 'Ocorreu um erro.'} onRetry={handleReset} />;
            case 'form':
            default:
                // FIX: In this case block, `appState` is narrowed to 'form', so the comparison `appState === 'loading'` is always false and causes a TypeScript error.
                // Replaced with `false` to reflect the logic and fix the error.
                return <IdeaForm onSubmit={handleCreateEbook} isLoading={false} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {renderContent()}
            </main>
        </div>
    );
};

export default App;