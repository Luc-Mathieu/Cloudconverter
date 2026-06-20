'use client';

import AnimatedBackground from '@/components/AnimatedBackground';
import FileConverter from '@/components/FileConverter';
import { motion } from 'framer-motion';
import './globals.css';

const floatingIcons = [
    { icon: '📄', label: 'PDF', x: '8%', y: '18%', delay: 0 },
    { icon: '🖼️', label: 'Image', x: '88%', y: '15%', delay: 0.5 },
    { icon: '📝', label: 'TXT', x: '5%', y: '65%', delay: 1.0 },
    { icon: '📊', label: 'Excel', x: '92%', y: '60%', delay: 1.5 },
    { icon: '📘', label: 'Word', x: '12%', y: '85%', delay: 2.0 },
];

export default function Home() {
    return (
        <>
            <AnimatedBackground />
            <main className="main-container">
                {/* Floating Format Icons */}
                <div className="floating-icons">
                    {floatingIcons.map((item, i) => (
                        <motion.div
                            key={i}
                            className="floating-icon"
                            style={{ left: item.x, top: item.y }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{
                                opacity: 0.6,
                                scale: 1,
                                y: [0, -15, 0],
                            }}
                            transition={{
                                opacity: { delay: item.delay, duration: 0.5 },
                                scale: { delay: item.delay, duration: 0.5 },
                                y: {
                                    delay: item.delay + 0.5,
                                    duration: 4 + i * 0.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                },
                            }}
                        >
                            <span className="floating-icon-emoji">{item.icon}</span>
                            <span className="floating-icon-label">{item.label}</span>
                        </motion.div>
                    ))}
                </div>

                {/* Hero */}
                <motion.div
                    className="hero-section"
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7 }}
                >
                    <h1 className="main-title">
                        Universal File Converter
                    </h1>
                    <p className="main-description">
                        Convert PDF, Word, Excel, Images and Text files directly in your browser.
                        <br />
                        <span className="main-description-highlight">
                            No uploads. No waiting. 100% private.
                        </span>
                    </p>
                </motion.div>

                {/* Main Converter */}
                <FileConverter />
            </main>
        </>
    );
}
