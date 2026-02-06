import React from 'react';

interface JuriqLogoProps {
    size?: number;
    className?: string;
}

export const JuriqLogo: React.FC<JuriqLogoProps> = ({ size = 32, className = '' }) => {
    return (
        <svg
            viewBox="0 0 64 64"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            width={size}
            height={size}
        >
            <defs>
                <linearGradient id="juriq-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#6366F1" />
                </linearGradient>
            </defs>

            {/* Main circle (scales and balance inspired) */}
            <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="url(#juriq-gradient)"
                strokeWidth="3"
            />

            {/* Inner J shape */}
            <path
                d="M 36 18 L 36 38 Q 36 44, 30 44 Q 24 44, 24 38"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
            />

            {/* Dot (like in 'q') */}
            <circle
                cx="44"
                cy="44"
                r="5"
                fill="url(#juriq-gradient)"
            />
        </svg>
    );
};

export default JuriqLogo;
