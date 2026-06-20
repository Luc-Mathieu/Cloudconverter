'use client';

import { Document, Packer, Paragraph, TextRun } from 'docx';

export async function txtToDocx(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const text = await file.text();
    onProgress?.(30);

    const lines = text.split('\n');
    const paragraphs = lines.map(
        (line) =>
            new Paragraph({
                children: [
                    new TextRun({
                        text: line,
                        size: 24,
                        font: 'Calibri',
                    }),
                ],
                spacing: { after: 100 },
            })
    );

    onProgress?.(60);

    const doc = new Document({
        sections: [{
            properties: {},
            children: paragraphs,
        }],
    });

    onProgress?.(80);
    const blob = await Packer.toBlob(doc);
    onProgress?.(100);
    return blob;
}
