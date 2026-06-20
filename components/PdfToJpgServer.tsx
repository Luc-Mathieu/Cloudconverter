'use client';

import { useState } from 'react';

export default function PdfToJpgServer() {
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
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch('/api/pdf-to-jpg', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Conversion failed');
            }

            const data = await response.json();
            setImages(data.images);
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
            <h2>PDF to JPG Converter (Server-Side)</h2>

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
