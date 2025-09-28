
import { GoogleGenAI, Type } from "@google/genai";
import { EbookStructure } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const structureSchema = {
    type: Type.OBJECT,
    properties: {
        title: {
            type: Type.STRING,
            description: "Um título criativo e cativante para o e-book, em português."
        },
        coverImagePrompt: {
            type: Type.STRING,
            description: "Um prompt em inglês, detalhado e vívido para gerar uma imagem de capa artística e bonita com o modelo 'imagen-4.0-generate-001'."
        },
        chapters: {
            type: Type.ARRAY,
            description: "Uma lista de 3 a 5 capítulos para o e-book.",
            items: {
                type: Type.OBJECT,
                properties: {
                    title: {
                        type: Type.STRING,
                        description: "O título do capítulo, em português."
                    },
                    contentPrompt: {
                        type: Type.STRING,
                        description: "Um prompt para o modelo de linguagem gerar o conteúdo completo deste capítulo. O conteúdo deve ser em português do Brasil, bem escrito, e formatado com Markdown simples (### para subtítulos, *palavra* para itálico)."
                    },
                    imagePrompt: {
                        type: Type.STRING,
                        description: "Um prompt em inglês, detalhado, para gerar uma imagem ilustrativa para este capítulo com o modelo 'imagen-4.0-generate-001'."
                    }
                },
                required: ["title", "contentPrompt", "imagePrompt"]
            }
        }
    },
    required: ["title", "coverImagePrompt", "chapters"]
};

export const generateEbookStructure = async (idea: string): Promise<EbookStructure> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Com base na seguinte ideia, gere uma estrutura para um mini e-book em português do Brasil. A ideia é: "${idea}". Siga estritamente o schema JSON fornecido.`,
            config: {
                responseMimeType: "application/json",
                responseSchema: structureSchema,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as EbookStructure;

    } catch (error) {
        console.error("Erro ao gerar a estrutura do e-book:", error);
        throw new Error("A IA não conseguiu gerar a estrutura do e-book. Tente uma ideia diferente.");
    }
};

export const generateChapterContent = async (prompt: string): Promise<string> => {
     try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
             config: {
                systemInstruction: "Você é um escritor de e-books. Escreva o conteúdo solicitado em português do Brasil, usando formatação Markdown simples (### para subtítulos, *palavra* para itálico, e parágrafos separados por linhas em branco).",
            },
        });
        return response.text;
    } catch (error) {
        console.error("Erro ao gerar conteúdo do capítulo:", error);
        throw new Error("A IA não conseguiu gerar o conteúdo para um capítulo.");
    }
};

export const generateImage = async (prompt: string, aspectRatio: '3:4' | '4:3'): Promise<string> => {
     try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: `${prompt}, digital art, high quality, detailed`,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes = response.generatedImages[0].image.imageBytes;
            return `data:image/jpeg;base64,${base64ImageBytes}`;
        }
        throw new Error("Nenhuma imagem foi gerada.");

    } catch (error) {
        console.error("Erro ao gerar imagem:", error);
        throw new Error("A IA não conseguiu gerar a imagem solicitada.");
    }
};
