
export interface EbookStructure {
  title: string;
  coverImagePrompt: string;
  chapters: {
    title: string;
    contentPrompt: string;
    imagePrompt: string;
  }[];
}

export interface Chapter {
  id: string;
  title: string;
  content: string; 
  imageUrl: string;
  imagePrompt: string;
}

export interface Ebook {
  title: string;
  coverImageUrl: string;
  coverImagePrompt: string;
  chapters: Chapter[];
}

export type Page =
  | { type: 'cover'; ebookTitle: string; imageUrl: string; imagePrompt: string; }
  | { type: 'chapter_start'; chapterId: string; title: string; imageUrl: string; imagePrompt: string; }
  | { type: 'content'; chapterId: string, content: string; };
