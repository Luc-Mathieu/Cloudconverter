'use client';

import * as XLSX from 'xlsx';

export async function txtToXlsx(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const text = await file.text();
    onProgress?.(30);

    const lines = text.split('\n');
    const rows = lines.map((line) => {
        // Try splitting by tab first, then comma, then treat as single cell
        if (line.includes('\t')) return line.split('\t');
        if (line.includes(',')) return line.split(',');
        return [line];
    });

    onProgress?.(50);

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');

    onProgress?.(80);

    const buffer = XLSX.write(workbook, { type: 'array', bookType: 'xlsx' });
    onProgress?.(100);

    return new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
}
