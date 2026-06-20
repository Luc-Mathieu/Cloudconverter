import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let textContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items.map((item: any) => item.str).join(' ');
            textContent += `\n--- Page ${i} ---\n${pageText}\n`;
        }

        const base64Text = Buffer.from(textContent).toString('base64');

        return NextResponse.json({
            text: `data:text/plain;base64,${base64Text}`,
            filename: file.name.replace('.pdf', '.txt')
        });
    } catch (error) {
        console.error('Error converting PDF to TXT:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to TXT' }, { status: 500 });
    }
}
