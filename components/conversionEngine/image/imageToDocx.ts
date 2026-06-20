'use client';

import {
    Document, Packer, Paragraph, ImageRun,
} from 'docx';

export async function imageToDocx(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const arrayBuffer = await file.arrayBuffer();
    onProgress?.(30);

    // Get image dimensions
    const dimensions = await new Promise<{ width: number; height: number }>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.width, height: img.height });
        img.onerror = reject;
        img.src = URL.createObjectURL(file);
    });

    onProgress?.(50);

    // Scale to fit within reasonable Word page dimensions (max ~600px wide)
    const maxWidth = 600;
    const scale = dimensions.width > maxWidth ? maxWidth / dimensions.width : 1;
    const finalWidth = Math.round(dimensions.width * scale);
    const finalHeight = Math.round(dimensions.height * scale);

    const doc = new Document({
        sections: [{
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new ImageRun({
                            data: arrayBuffer,
                            transformation: {
                                width: finalWidth,
                                height: finalHeight,
                            },
                            type: file.type === 'image/png' ? 'png' : 'jpg',
                        }),
                    ],
                }),
            ],
        }],
    });

    onProgress?.(80);
    const blob = await Packer.toBlob(doc);
    onProgress?.(100);
    return blob;
}
