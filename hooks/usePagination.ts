
import { useMemo } from 'react';
import type { Ebook, Page } from '../types';

export const usePagination = (ebook: Ebook, charsPerPage: number): Page[] => {
    return useMemo(() => {
        if (!ebook) return [];

        const pages: Page[] = [];

        // 1. Cover page
        pages.push({
            type: 'cover',
            ebookTitle: ebook.title,
            imageUrl: ebook.coverImageUrl,
            imagePrompt: ebook.coverImagePrompt,
        });

        // 2. Chapter pages
        ebook.chapters.forEach(chapter => {
            // Chapter start page
            pages.push({
                type: 'chapter_start',
                chapterId: chapter.id,
                title: chapter.title,
                imageUrl: chapter.imageUrl,
                imagePrompt: chapter.imagePrompt,
            });

            // Content pages
            const paragraphs = chapter.content.split('\n').filter(p => p.trim() !== '');
            let currentPageContent = '';

            for (const para of paragraphs) {
                if ((currentPageContent + para).length > charsPerPage && currentPageContent.length > 0) {
                    pages.push({
                        type: 'content',
                        chapterId: chapter.id,
                        content: currentPageContent,
                    });
                    currentPageContent = '';
                }
                currentPageContent += (currentPageContent ? '\n\n' : '') + para;
            }

            if (currentPageContent.length > 0) {
                pages.push({
                    type: 'content',
                    chapterId: chapter.id,
                    content: currentPageContent,
                });
            }
        });

        return pages;
    }, [ebook, charsPerPage]);
};
