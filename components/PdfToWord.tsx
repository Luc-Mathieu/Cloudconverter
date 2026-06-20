'use client';

import { useState } from 'react';

export default function PdfToWord() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [docxUrl, setDocxUrl] = useState<string>('');
    const [filename, setFilename] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setDocxUrl('');
        }
    };

    const convertToWord = async () => {
        if (!file) return;

        setConverting(true);
        setDocxUrl('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/pdf-to-word', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const data = await response.json();
            setDocxUrl(data.docx);
            setFilename(data.filename);
        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Error converting PDF to Word');
        } finally {
            setConverting(false);
        }
    };

    const downloadWord = () => {
        if (!docxUrl) return;

        const link = document.createElement('a');
        link.href = docxUrl;
        link.download = filename || 'converted.docx';
        link.click();
    };

    return (
        <div className="converter-container">
            <h2>PDF to Word Converter</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                />

                <button
                    onClick={convertToWord}
                    disabled={!file || converting}
                    className="convert-button"
                >
                    {converting ? 'Converting...' : 'Convert to Word'}
                </button>
            </div>

            {docxUrl && (
                <div className="download-section">
                    <button onClick={downloadWord} className="download-button">
                        Download Word Document
                    </button>
                </div>
            )}
        </div>
    );
}
