'use client';

import { motion } from 'framer-motion';

interface ProgressRingProps {
    progress: number;
    stage: string;
}

export default function ProgressRing({ progress, stage }: ProgressRingProps) {
    const radius = 54;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;
    const isComplete = progress >= 100;

    return (
        <motion.div
            className="progress-ring-container"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
            <div className="progress-ring-wrapper">
                <svg width="140" height="140" viewBox="0 0 140 140">
                    {/* Background circle */}
                    <circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="rgba(255,255,255,0.08)"
                        strokeWidth="8"
                    />
                    {/* Glow filter */}
                    <defs>
                        <filter id="glow">
                            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#667eea" />
                            <stop offset="50%" stopColor="#764ba2" />
                            <stop offset="100%" stopColor="#f093fb" />
                        </linearGradient>
                    </defs>
                    {/* Progress circle */}
                    <motion.circle
                        cx="70"
                        cy="70"
                        r={radius}
                        fill="none"
                        stroke="url(#progressGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        transform="rotate(-90 70 70)"
                        filter="url(#glow)"
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                    />
                </svg>

                <div className="progress-ring-text">
                    <motion.span
                        className="progress-ring-percentage"
                        key={progress}
                        initial={{ scale: 1.3, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {isComplete ? '✓' : `${progress}%`}
                    </motion.span>
                </div>
            </div>

            <motion.p
                className="progress-stage"
                key={stage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {stage}
            </motion.p>
        </motion.div>
    );
}
