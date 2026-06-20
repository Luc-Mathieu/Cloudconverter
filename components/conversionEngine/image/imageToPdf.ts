'use client';

import { jsPDF } from 'jspdf';

export async function imageToPdf(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                onProgress?.(40);

                const isLandscape = img.width > img.height;
                const pdf = new jsPDF({
                    orientation: isLandscape ? 'landscape' : 'portrait',
                    unit: 'px',
                    format: [img.width, img.height],
                });

                pdf.addImage(
                    e.target!.result as string,
                    file.type === 'image/png' ? 'PNG' : 'JPEG',
                    0,
                    0,
                    img.width,
                    img.height
                );

                onProgress?.(80);

                const blob = pdf.output('blob');
                onProgress?.(100);
                resolve(blob);
            };
            img.onerror = reject;
            img.src = e.target!.result as string;
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
