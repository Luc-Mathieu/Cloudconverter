'use client';

import * as XLSX from 'xlsx';

export async function xlsxToTxt(
    file: File,
    onProgress?: (progress: number) => void
): Promise<Blob> {
    onProgress?.(10);

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    onProgress?.(30);

    let textContent = '';

    for (let s = 0; s < workbook.SheetNames.length; s++) {
        const sheetName = workbook.SheetNames[s];
        const sheet = workbook.Sheets[sheetName];
        const csv = XLSX.utils.sheet_to_csv(sheet);

        textContent += `=== ${sheetName} ===\n${csv}\n\n`;
        onProgress?.(30 + Math.round(((s + 1) / workbook.SheetNames.length) * 60));
    }

    onProgress?.(95);
    const blob = new Blob([textContent], { type: 'text/plain' });
    onProgress?.(100);
    return blob;
}
