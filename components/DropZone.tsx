'use client';

import React, { useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropZoneProps {
    onFileSelect: (file: File) => void;
    acceptedTypes: string;
}

export default function DropZone({ onFileSelect, acceptedTypes }: DropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileSelect(files[0]);
        }
    }, [onFileSelect]);

    const handleClick = () => {
        inputRef.current?.click();
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
        }
    };

    return (
        <motion.div
            className={`dropzone ${isDragging ? 'dropzone-active' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <input
                ref={inputRef}
                type="file"
                accept={acceptedTypes}
                onChange={handleFileInput}
                style={{ display: 'none' }}
                id="file-upload-input"
            />

            <AnimatePresence mode="wait">
                {isDragging ? (
                    <motion.div
                        key="dragging"
                        className="dropzone-content"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="dropzone-icon dropzone-icon-active">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="dropzone-text-primary">Release to upload</p>
                    </motion.div>
                ) : (
                    <motion.div
                        key="idle"
                        className="dropzone-content"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                    >
                        <div className="dropzone-icon">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                <polyline points="17 8 12 3 7 8" />
                                <line x1="12" y1="3" x2="12" y2="15" />
                            </svg>
                        </div>
                        <p className="dropzone-text-primary">
                            Drag & drop your file here
                        </p>
                        <p className="dropzone-text-secondary">
                            or click to browse
                        </p>
                        <div className="dropzone-formats">
                            <span className="format-badge">PDF</span>
                            <span className="format-badge">JPG</span>
                            <span className="format-badge">PNG</span>
                            <span className="format-badge">DOCX</span>
                            <span className="format-badge">XLSX</span>
                            <span className="format-badge">TXT</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Animated border */}
            <div className="dropzone-border-glow" />
        </motion.div>
    );
}
