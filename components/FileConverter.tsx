'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DropZone from './DropZone';
import FormatSelector from './FormatSelector';
import ProgressRing from './ProgressRing';
import {
    detectFormat,
    getAvailableOutputs,
    convert,
    type InputFormat,
    type OutputFormat,
    type ConversionResult,
} from './conversionEngine';

type AppState = 'idle' | 'file-selected' | 'converting' | 'done' | 'error';

const FORMAT_LABELS: Record<string, string> = {
    pdf: 'PDF Document',
    jpg: 'JPEG Image',
    png: 'PNG Image',
    txt: 'Text File',
    xlsx: 'Excel Spreadsheet',
    docx: 'Word Document',
};

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ACCEPTED_TYPES = '.pdf,.jpg,.jpeg,.png,.txt,.xlsx,.docx,.doc';

export default function FileConverter() {
    const [state, setState] = useState<AppState>('idle');
    const [file, setFile] = useState<File | null>(null);
    const [inputFormat, setInputFormat] = useState<InputFormat | null>(null);
    const [outputFormat, setOutputFormat] = useState<OutputFormat | null>(null);
    const [availableFormats, setAvailableFormats] = useState<OutputFormat[]>([]);
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('');
    const [result, setResult] = useState<ConversionResult | null>(null);
    const [error, setError] = useState<string>('');
    const [showDocWarning, setShowDocWarning] = useState(false);

    const handleFileSelect = useCallback((selectedFile: File) => {
        // Detect legacy .doc files
        const ext = selectedFile.name.split('.').pop()?.toLowerCase();
        if (ext === 'doc') {
            setShowDocWarning(true);
            return;
        }

        const format = detectFormat(selectedFile);
        if (!format) {
            setError('Unsupported file format. Please upload PDF, JPG, PNG, DOCX, XLSX, or TXT files.');
            setState('error');
            return;
        }

        setFile(selectedFile);
        setInputFormat(format);
        setAvailableFormats(getAvailableOutputs(format));
        setOutputFormat(null);
        setResult(null);
        setError('');
        setProgress(0);
        setState('file-selected');
    }, []);

    const handleConvert = useCallback(async () => {
        if (!file || !inputFormat || !outputFormat) return;

        setState('converting');
        setProgress(0);
        setStage('Analyzing file...');

        try {
            // Simulate staged progress
            setStage('Analyzing file...');
            await new Promise((r) => setTimeout(r, 300));

            setStage('Converting...');
            const conversionResult = await convert(
                file,
                inputFormat,
                outputFormat,
                (p) => setProgress(p)
            );

            setStage('Preparing download...');
            await new Promise((r) => setTimeout(r, 400));

            setResult(conversionResult);
            setProgress(100);
            setStage('Done!');
            setState('done');
        } catch (err) {
            console.error('Conversion error:', err);
            setError(`Conversion failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
            setState('error');
        }
    }, [file, inputFormat, outputFormat]);

    const handleDownload = useCallback(() => {
        if (!result) return;
        const url = URL.createObjectURL(result.blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, [result]);

    const handleReset = useCallback(() => {
        setFile(null);
        setInputFormat(null);
        setOutputFormat(null);
        setAvailableFormats([]);
        setProgress(0);
        setStage('');
        setResult(null);
        setError('');
        setState('idle');
    }, []);

    return (
        <div className="file-converter">
            {/* Legacy DOC Warning Popup */}
            <AnimatePresence>
                {showDocWarning && (
                    <motion.div
                        className="doc-warning-overlay"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowDocWarning(false)}
                    >
                        <motion.div
                            className="doc-warning-modal"
                            initial={{ opacity: 0, scale: 0.85, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 30 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="doc-warning-icon">⚠️</div>
                            <h3 className="doc-warning-title">Legacy Word Document Detected</h3>
                            <p className="doc-warning-subtitle">This file uses the older <strong>.DOC</strong> format.</p>
                            <p className="doc-warning-message">
                                Please save it as <strong>DOCX</strong> using Microsoft Word or LibreOffice
                                for best conversion results.
                            </p>
                            <motion.button
                                className="doc-warning-btn"
                                onClick={() => setShowDocWarning(false)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                id="doc-warning-dismiss-btn"
                            >
                                Got it
                            </motion.button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
                {/* IDLE STATE — Drop Zone */}
                {state === 'idle' && (
                    <motion.div
                        key="idle"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        <DropZone
                            onFileSelect={handleFileSelect}
                            acceptedTypes={ACCEPTED_TYPES}
                        />
                    </motion.div>
                )}

                {/* FILE SELECTED — Show info + format selector */}
                {state === 'file-selected' && file && inputFormat && (
                    <motion.div
                        key="selected"
                        className="converter-panel"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.4 }}
                    >
                        {/* File Info Card */}
                        <motion.div
                            className="file-info-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="file-info-icon">
                                {inputFormat === 'pdf' && '📄'}
                                {(inputFormat === 'jpg' || inputFormat === 'png') && '🖼️'}
                                {inputFormat === 'txt' && '📝'}
                                {inputFormat === 'xlsx' && '📊'}
                                {inputFormat === 'docx' && '📘'}
                            </div>
                            <div className="file-info-details">
                                <h3 className="file-info-name">{file.name}</h3>
                                <div className="file-info-meta">
                                    <span className="file-info-type">
                                        {FORMAT_LABELS[inputFormat]}
                                    </span>
                                    <span className="file-info-separator">•</span>
                                    <span className="file-info-size">
                                        {formatFileSize(file.size)}
                                    </span>
                                </div>
                            </div>
                            <button
                                className="file-info-change"
                                onClick={handleReset}
                                id="change-file-btn"
                            >
                                Change
                            </button>
                        </motion.div>

                        {/* Format Selector */}
                        <FormatSelector
                            formats={availableFormats}
                            selectedFormat={outputFormat}
                            onSelect={setOutputFormat}
                        />

                        {/* Convert Button */}
                        <motion.button
                            className={`convert-action-btn ${!outputFormat ? 'convert-action-btn-disabled' : ''}`}
                            onClick={handleConvert}
                            disabled={!outputFormat}
                            whileHover={outputFormat ? { scale: 1.03, y: -2 } : {}}
                            whileTap={outputFormat ? { scale: 0.97 } : {}}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            id="convert-btn"
                        >
                            <span className="convert-action-btn-text">
                                {outputFormat
                                    ? `Convert to ${outputFormat.toUpperCase()}`
                                    : 'Select a format above'}
                            </span>
                            <span className="convert-action-btn-arrow">→</span>
                        </motion.button>
                    </motion.div>
                )}

                {/* CONVERTING — Progress */}
                {state === 'converting' && (
                    <motion.div
                        key="converting"
                        className="converter-panel converter-panel-centered"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                    >
                        <ProgressRing progress={progress} stage={stage} />
                        <p className="converting-filename">{file?.name}</p>
                    </motion.div>
                )}

                {/* DONE — Result Card */}
                {state === 'done' && result && (
                    <motion.div
                        key="done"
                        className="converter-panel converter-panel-centered"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <motion.div
                            className="result-card"
                            initial={{ y: 20 }}
                            animate={{ y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="result-success-icon">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{
                                        type: 'spring',
                                        stiffness: 400,
                                        damping: 15,
                                        delay: 0.3,
                                    }}
                                >
                                    ✅
                                </motion.div>
                            </div>

                            <h3 className="result-title">Conversion Complete!</h3>

                            <div className="result-details">
                                <div className="result-detail-row">
                                    <span className="result-detail-label">File</span>
                                    <span className="result-detail-value">{result.filename}</span>
                                </div>
                                <div className="result-detail-row">
                                    <span className="result-detail-label">Format</span>
                                    <span className="result-detail-value">{outputFormat?.toUpperCase()}</span>
                                </div>
                                <div className="result-detail-row">
                                    <span className="result-detail-label">Size</span>
                                    <span className="result-detail-value">{formatFileSize(result.blob.size)}</span>
                                </div>
                            </div>

                            <div className="result-actions">
                                <motion.button
                                    className="download-action-btn"
                                    onClick={handleDownload}
                                    whileHover={{ scale: 1.05, y: -2 }}
                                    whileTap={{ scale: 0.95 }}
                                    id="download-btn"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    Download
                                </motion.button>

                                <motion.button
                                    className="reset-action-btn"
                                    onClick={handleReset}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    id="convert-another-btn"
                                >
                                    Convert Another
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {/* ERROR STATE */}
                {state === 'error' && (
                    <motion.div
                        key="error"
                        className="converter-panel converter-panel-centered"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <div className="error-card">
                            <div className="error-icon">❌</div>
                            <h3 className="error-title">Something went wrong</h3>
                            <p className="error-message">{error}</p>
                            <motion.button
                                className="reset-action-btn"
                                onClick={handleReset}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                id="try-again-btn"
                            >
                                Try Again
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
