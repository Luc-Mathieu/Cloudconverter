import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import * as XLSX from 'xlsx';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const workbook = XLSX.utils.book_new();

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const textItems = textContent.items.map((item: any) => item.str);

            // Create worksheet from text
            const worksheet = XLSX.utils.aoa_to_sheet([textItems]);
            XLSX.utils.book_append_sheet(workbook, worksheet, `Page ${i}`);
        }

        // Generate Excel file
        const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
        const base64Excel = excelBuffer.toString('base64');

        return NextResponse.json({
            excel: `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64Excel}`,
            filename: file.name.replace('.pdf', '.xlsx')
        });
    } catch (error) {
        console.error('Error converting PDF to Excel:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to Excel' }, { status: 500 });
    }
}
