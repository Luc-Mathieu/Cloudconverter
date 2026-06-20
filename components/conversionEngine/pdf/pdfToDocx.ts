'use client';

import * as pdfjsLib from 'pdfjs-dist';
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function pdfToDocx(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const paragraphs: Paragraph[] = [];

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items.map((item: any) => item.str).join(' ');

        paragraphs.push(
            new Paragraph({
                children: [
                    new TextRun({
                        text: `Page ${i}`,
                        bold: true,
                        size: 28,
                    }),
                ],
                heading: HeadingLevel.HEADING_2,
                spacing: { before: 400, after: 200 },
            })
        );

        // Split text into reasonable paragraphs
        const sentences = pageText.split(/(?<=[.!?])\s+/);
        for (const sentence of sentences) {
            if (sentence.trim()) {
                paragraphs.push(
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: sentence.trim(),
                                size: 24,
                            }),
                        ],
                        spacing: { after: 120 },
                    })
                );
            }
        }

        onProgress?.(Math.round((i / pdf.numPages) * 100));
    }

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    return await Packer.toBlob(doc);
}
