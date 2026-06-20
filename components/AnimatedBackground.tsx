'use client';

export default function AnimatedBackground() {
    return (
        <div className="animated-background">
            {/* Gradient Orbs */}
            <div className="gradient-orbs">
                <div className="orb orb-1"></div>
                <div className="orb orb-2"></div>
                <div className="orb orb-3"></div>
                <div className="orb orb-4"></div>
                <div className="orb orb-5"></div>
                <div className="orb orb-6"></div>
                <div className="orb orb-7"></div>
                <div className="orb orb-8"></div>
            </div>

            {/* Aurora Shimmer */}
            <div className="aurora-layer">
                <div className="aurora aurora-1"></div>
                <div className="aurora aurora-2"></div>
                <div className="aurora aurora-3"></div>
            </div>

            {/* Floating Particles */}
            <div className="particles">
                {Array.from({ length: 60 }).map((_, i) => (
                    <div key={i} className="particle" style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 25}s`,
                        animationDuration: `${15 + Math.random() * 25}s`,
                        width: `${1 + Math.random() * 3}px`,
                        height: `${1 + Math.random() * 3}px`,
                    }}></div>
                ))}
            </div>

            {/* Mesh Grid */}
            <div className="mesh-gradient"></div>

            {/* Constellation Lines */}
            <svg className="constellation-layer" width="100%" height="100%">
                <line x1="10%" y1="20%" x2="30%" y2="15%" className="constellation-line" style={{ animationDelay: '0s' }} />
                <line x1="30%" y1="15%" x2="25%" y2="40%" className="constellation-line" style={{ animationDelay: '2s' }} />
                <line x1="70%" y1="10%" x2="85%" y2="30%" className="constellation-line" style={{ animationDelay: '4s' }} />
                <line x1="85%" y1="30%" x2="75%" y2="55%" className="constellation-line" style={{ animationDelay: '6s' }} />
                <line x1="15%" y1="70%" x2="35%" y2="80%" className="constellation-line" style={{ animationDelay: '8s' }} />
                <line x1="60%" y1="75%" x2="80%" y2="85%" className="constellation-line" style={{ animationDelay: '10s' }} />
                <line x1="45%" y1="25%" x2="55%" y2="45%" className="constellation-line" style={{ animationDelay: '3s' }} />
                <line x1="20%" y1="55%" x2="40%" y2="65%" className="constellation-line" style={{ animationDelay: '7s' }} />
            </svg>
        </div>
    );
}
