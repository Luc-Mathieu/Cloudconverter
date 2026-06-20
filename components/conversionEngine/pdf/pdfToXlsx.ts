'use client';

import * as pdfjsLib from 'pdfjs-dist';
import * as XLSX from 'xlsx';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export async function pdfToXlsx(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const workbook = XLSX.utils.book_new();

    for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();

        // Group items by Y position to form rows
        const itemsByRow = new Map<number, string[]>();
        content.items.forEach((item: any) => {
            const y = Math.round(item.transform[5]);
            if (!itemsByRow.has(y)) {
                itemsByRow.set(y, []);
            }
            itemsByRow.get(y)!.push(item.str);
        });

        // Sort rows by Y (descending, since PDF Y is bottom-up)
        const sortedRows = Array.from(itemsByRow.entries())
            .sort((a, b) => b[0] - a[0])
            .map(([, cells]) => cells);

        const worksheet = XLSX.utils.aoa_to_sheet(
            sortedRows.length > 0 ? sortedRows : [['(empty page)']]
        );
        XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
        onProgress?.(Math.round((i / pdf.numPages) * 100));
    }

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}
