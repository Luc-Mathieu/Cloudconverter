import { NextRequest, NextResponse } from 'next/server';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';
import * as mammoth from 'mammoth';
import JSZip from 'jszip';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let htmlContent = '';

        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            htmlContent += `<h2>Page ${i}</h2><p>${pageText}</p>`;
        }

        // Create a simple DOCX file structure
        const zip = new JSZip();

        // Add document.xml
        const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    <w:p>
      <w:r>
        <w:t>${htmlContent.replace(/<[^>]*>/g, '\n')}</w:t>
      </w:r>
    </w:p>
  </w:body>
</w:document>`;

        zip.file('word/document.xml', documentXml);

        // Add [Content_Types].xml
        zip.file('[Content_Types].xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`);

        const docxBuffer = await zip.generateAsync({ type: 'nodebuffer' });
        const base64Docx = docxBuffer.toString('base64');

        return NextResponse.json({
            docx: `data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,${base64Docx}`,
            filename: file.name.replace('.pdf', '.docx')
        });
    } catch (error) {
        console.error('Error converting PDF to Word:', error);
        return NextResponse.json({ error: 'Failed to convert PDF to Word' }, { status: 500 });
    }
}
