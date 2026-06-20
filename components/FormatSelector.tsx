'use client';

import { motion } from 'framer-motion';
import type { OutputFormat } from './conversionEngine';

interface FormatSelectorProps {
    formats: OutputFormat[];
    selectedFormat: OutputFormat | null;
    onSelect: (format: OutputFormat) => void;
    disabled?: boolean;
}

const FORMAT_CONFIG: Record<string, { icon: string; label: string; color: string }> = {
    pdf: { icon: '📄', label: 'PDF', color: '#ef4444' },
    jpg: { icon: '🖼️', label: 'JPG', color: '#f59e0b' },
    txt: { icon: '📝', label: 'TXT', color: '#10b981' },
    xlsx: { icon: '📊', label: 'Excel', color: '#22c55e' },
    docx: { icon: '📘', label: 'Word', color: '#3b82f6' },
};

export default function FormatSelector({
    formats,
    selectedFormat,
    onSelect,
    disabled = false,
}: FormatSelectorProps) {
    const allFormats: OutputFormat[] = ['pdf', 'jpg', 'txt', 'xlsx', 'docx'];

    return (
        <motion.div
            className="format-selector"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
        >
            <p className="format-selector-label">Convert to:</p>
            <div className="format-buttons">
                {allFormats.map((format, index) => {
                    const isAvailable = formats.includes(format);
                    const isSelected = selectedFormat === format;
                    const config = FORMAT_CONFIG[format];

                    return (
                        <motion.button
                            key={format}
                            className={`format-btn ${isSelected ? 'format-btn-active' : ''} ${!isAvailable ? 'format-btn-disabled' : ''}`}
                            onClick={() => isAvailable && !disabled && onSelect(format)}
                            disabled={!isAvailable || disabled}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={isAvailable ? { scale: 1.08, y: -2 } : {}}
                            whileTap={isAvailable ? { scale: 0.95 } : {}}
                            style={{
                                '--format-color': config.color,
                            } as React.CSSProperties}
                            id={`format-btn-${format}`}
                        >
                            <span className="format-btn-icon">{config.icon}</span>
                            <span className="format-btn-label">{config.label}</span>
                            {isSelected && (
                                <motion.div
                                    className="format-btn-glow"
                                    layoutId="formatGlow"
                                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}
