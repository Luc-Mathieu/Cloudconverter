'use client';

import { useState } from 'react';

export default function PdfToTxt() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [txtUrl, setTxtUrl] = useState<string>('');
    const [filename, setFilename] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setTxtUrl('');
        }
    };

    const convertToTxt = async () => {
        if (!file) return;

        setConverting(true);
        setTxtUrl('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/pdf-to-txt', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const data = await response.json();
            setTxtUrl(data.text);
            setFilename(data.filename);
        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Error converting PDF to TXT');
        } finally {
            setConverting(false);
        }
    };

    const downloadTxt = () => {
        if (!txtUrl) return;

        const link = document.createElement('a');
        link.href = txtUrl;
        link.download = filename || 'converted.txt';
        link.click();
    };

    return (
        <div className="converter-container">
            <h2>PDF to TXT Converter</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                />

                <button
                    onClick={convertToTxt}
                    disabled={!file || converting}
                    className="convert-button"
                >
                    {converting ? 'Converting...' : 'Convert to TXT'}
                </button>
            </div>

            {txtUrl && (
                <div className="download-section">
                    <button onClick={downloadTxt} className="download-button">
                        Download Text File
                    </button>
                </div>
            )}
        </div>
    );
}
