'use client';

import mammoth from 'mammoth';
import { jsPDF } from 'jspdf';

export async function docxToPdf(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const arrayBuffer = await file.arrayBuffer();
    onProgress?.(20);

    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value;
    onProgress?.(40);

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    const maxLineWidth = pageWidth - margin * 2;
    let y = margin;

    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);

    const lines = pdf.splitTextToSize(text, maxLineWidth);
    const totalLines = lines.length;

    for (let i = 0; i < totalLines; i++) {
        if (y + lineHeight > pageHeight - margin) {
            pdf.addPage();
            y = margin;
        }
        pdf.text(lines[i], margin, y);
        y += lineHeight;

        if (i % 50 === 0) {
            onProgress?.(40 + Math.round((i / totalLines) * 50));
        }
    }

    onProgress?.(95);
    const blob = pdf.output('blob');
    onProgress?.(100);
    return blob;
}
