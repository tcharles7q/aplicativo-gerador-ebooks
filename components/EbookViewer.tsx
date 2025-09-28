
import React from 'react';
import type { Ebook, Chapter, Page } from '../types';
import { usePagination } from '../hooks/usePagination';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import { generateImage } from '../services/geminiService';

// Add these to your global scope if they aren't already, for jspdf and html2canvas from CDN
declare const jspdf: any;
declare const html2canvas: any;

interface EbookViewerProps {
    ebook: Ebook;
    setEbook: (ebook: Ebook) => void;
    onReset: () => void;
}

const EbookViewer: React.FC<EbookViewerProps> = ({ ebook, setEbook, onReset }) => {
    const pages = usePagination(ebook, 1800);

    const handleTextUpdate = (path: string, newValue: string) => {
        const newEbook = JSON.parse(JSON.stringify(ebook));
        const keys = path.split('.');
        let current: any = newEbook;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = newValue;
        setEbook(newEbook);
    };

    const handleImageRegenerate = async (path: string, prompt: string) => {
        const newEbook = { ...ebook };
        const keys = path.split('.');
        let current: any = newEbook;
        for (let i = 0; i < keys.length - 1; i++) {
            current = current[keys[i]];
        }
        
        const originalUrl = current[keys[keys.length - 1]];
        current[keys[keys.length - 1]] = 'loading'; // Indicate loading
        setEbook(newEbook);

        try {
            const aspectRatio = path.includes('cover') ? '3:4' : '4:3';
            const newImageUrl = await generateImage(prompt, aspectRatio);
            current[keys[keys.length - 1]] = newImageUrl;
        } catch (e) {
            console.error("Failed to regenerate image", e);
            current[keys[keys.length - 1]] = originalUrl; // Revert on failure
        }
        setEbook({ ...newEbook });
    };

    const handleDownloadPdf = async () => {
        const { jsPDF } = jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'px',
            format: 'a4'
        });
        
        const pageElements = document.querySelectorAll('.ebook-page');
        const A4_WIDTH = pdf.internal.pageSize.getWidth();
        const A4_HEIGHT = pdf.internal.pageSize.getHeight();

        for (let i = 0; i < pageElements.length; i++) {
            const pageEl = pageElements[i] as HTMLElement;
            const canvas = await html2canvas(pageEl, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            if (i > 0) {
                pdf.addPage();
            }
            
            pdf.addImage(imgData, 'PNG', 0, 0, A4_WIDTH, A4_HEIGHT);
        }
        
        pdf.save(`${ebook.title.replace(/\s+/g, '-')}.pdf`);
    };

    const renderPageContent = (page: Page) => {
        switch (page.type) {
            case 'cover':
                return (
                    <div className="flex flex-col h-full">
                        <div className="flex-grow">
                             <EditableImage
                                src={page.imageUrl}
                                alt={`Capa do e-book: ${page.ebookTitle}`}
                                onRegenerate={() => handleImageRegenerate('coverImageUrl', page.imagePrompt)}
                            />
                        </div>
                        <div className="p-12 text-center">
                             <EditableText
                                initialValue={page.ebookTitle}
                                onSave={(v) => handleTextUpdate('title', v)}
                                as="h1"
                                className="text-4xl font-bold"
                            />
                        </div>
                    </div>
                );
            case 'chapter_start':
                const chapterIndex = ebook.chapters.findIndex(c => c.id === page.chapterId);
                return (
                    <div className="flex flex-col h-full">
                         <EditableImage
                            src={page.imageUrl}
                            alt={`Ilustração para: ${page.title}`}
                            onRegenerate={() => handleImageRegenerate(`chapters.${chapterIndex}.imageUrl`, page.imagePrompt)}
                        />
                        <div className="p-12">
                             <EditableText
                                initialValue={page.title}
                                onSave={(v) => handleTextUpdate(`chapters.${chapterIndex}.title`, v)}
                                as="h2"
                                className="text-3xl font-bold"
                            />
                        </div>
                    </div>
                );
            case 'content':
                const contentChapterIndex = ebook.chapters.findIndex(c => c.id === page.chapterId);
                return (
                     <EditableText
                        initialValue={page.content}
                        onSave={(v) => handleTextUpdate(`chapters.${contentChapterIndex}.content`, v)}
                        as="div"
                        className="prose dark:prose-invert max-w-none p-12"
                    />
                );
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center gap-4 mb-8 sticky top-4 z-10">
                <button onClick={onReset} className="py-2 px-5 bg-gray-600 text-white font-semibold rounded-md shadow-md hover:bg-gray-700 transition">
                    Criar Outro E-book
                </button>
                <button onClick={handleDownloadPdf} className="py-2 px-5 bg-indigo-600 text-white font-semibold rounded-md shadow-md hover:bg-indigo-700 transition">
                    Baixar como PDF
                </button>
            </div>
            <div className="space-y-8">
                {pages.map((page, index) => (
                    <div key={index} className="ebook-page mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-sm" style={{ aspectRatio: '210/297', width: '600px'}}>
                        {renderPageContent(page)}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EbookViewer;
