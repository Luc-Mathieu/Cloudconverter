'use client';

import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export async function xlsxToPdf(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    onProgress?.(30);

    const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    const cellPadding = 3;
    const lineHeight = 7;

    let isFirstSheet = true;

    for (let s = 0; s < workbook.SheetNames.length; s++) {
        const sheetName = workbook.SheetNames[s];
        const sheet = workbook.Sheets[sheetName];
        const data: string[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

        if (data.length === 0) continue;

        if (!isFirstSheet) pdf.addPage();
        isFirstSheet = false;

        // Sheet title
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(sheetName, margin, margin + 5);

        pdf.setFontSize(9);
        pdf.setFont('helvetica', 'normal');

        const maxCols = Math.max(...data.map((r) => r.length));
        const colWidth = Math.min(
            (pageWidth - margin * 2) / maxCols,
            50
        );

        let y = margin + 12;

        for (let r = 0; r < data.length; r++) {
            if (y + lineHeight > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }

            for (let c = 0; c < data[r].length; c++) {
                const x = margin + c * colWidth;
                const cellText = String(data[r][c] ?? '');
                pdf.text(cellText.substring(0, 30), x + cellPadding, y + cellPadding + 3);
                pdf.rect(x, y, colWidth, lineHeight);
            }
            y += lineHeight;
        }

        onProgress?.(30 + Math.round(((s + 1) / workbook.SheetNames.length) * 60));
    }

    onProgress?.(95);
    const blob = pdf.output('blob');
    onProgress?.(100);
    return blob;
}
