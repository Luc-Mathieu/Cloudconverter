'use client';

import { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Set worker path
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function PdfToJpg() {
    const [file, setFile] = useState<File | null>(null);
    const [converting, setConverting] = useState(false);
    const [images, setImages] = useState<string[]>([]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setImages([]);
        }
    };

    const convertToJPG = async () => {
        if (!file) return;

        setConverting(true);
        setImages([]);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            const imageUrls: string[] = [];

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                if (!context) continue;

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise;

                const imageUrl = canvas.toDataURL('image/jpeg', 0.85);
                imageUrls.push(imageUrl);
            }

            setImages(imageUrls);
        } catch (error) {
            console.error('Error converting PDF:', error);
            alert('Error converting PDF to JPG');
        } finally {
            setConverting(false);
        }
    };

    const downloadImage = (imageUrl: string, index: number) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `page-${index + 1}.jpg`;
        link.click();
    };

    return (
        <div className="converter-container">
            <h2>PDF to JPG Converter (Client-Side)</h2>

            <div className="upload-section">
                <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="file-input"
                />

                <button
                    onClick={convertToJPG}
                    disabled={!file || converting}
                    className="convert-button"
                >
                    {converting ? 'Converting...' : 'Convert to JPG'}
                </button>
            </div>

            {images.length > 0 && (
                <div className="images-grid">
                    {images.map((imageUrl, index) => (
                        <div key={index} className="image-item">
                            <img src={imageUrl} alt={`Page ${index + 1}`} />
                            <button
                                onClick={() => downloadImage(imageUrl, index)}
                                className="download-button"
                            >
                                Download Page {index + 1}
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
