'use client';

import mammoth from 'mammoth';

export async function docxToTxt(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const arrayBuffer = await file.arrayBuffer();
    onProgress?.(30);

    const result = await mammoth.extractRawText({ arrayBuffer });
    onProgress?.(80);

    const blob = new Blob([result.value], { type: 'text/plain' });
    onProgress?.(100);
    return blob;
}
