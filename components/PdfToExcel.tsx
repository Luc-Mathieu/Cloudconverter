'use client';

import { useState } from 'react';

export default function PdfToExcel() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [excelUrl, setExcelUrl] = useState<string>('');
    const [filename, setFilename] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setExcelUrl('');
        }
    };

    const convertToExcel = async () => {
        if (!file) return;

        setConverting(true);
        setExcelUrl('');

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/pdf-to-excel', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const data = await response.json();
            setExcelUrl(data.excel);
            setFilename(data.filename);
        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Error converting PDF to Excel');
        } finally {
            setConverting(false);
        }
    };

    const downloadExcel = () => {
        if (!excelUrl) return;

        const link = document.createElement('a');
        link.href = excelUrl;
        link.download = filename || 'converted.xlsx';
        link.click();
    };

    return (
        <div className="converter-container">
            <h2>PDF to Excel Converter</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                />

                <button
                    onClick={convertToExcel}
                    disabled={!file || converting}
                    className="convert-button"
                >
                    {converting ? 'Converting...' : 'Convert to Excel'}
                </button>
            </div>

            {excelUrl && (
                <div className="download-section">
                    <button onClick={downloadExcel} className="download-button">
                        Download Excel File
                    </button>
                </div>
            )}
        </div>
    );
}
