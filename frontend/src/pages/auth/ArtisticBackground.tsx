import { useEffect, useRef } from 'react';
import { motion, useTransform, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';

export const ArtisticBackground = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const smoothMouseX = useSpring(mouseX, { stiffness: 50, damping: 20 });
    const smoothMouseY = useSpring(mouseY, { stiffness: 50, damping: 20 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;
            mouseX.set(clientX / innerWidth);
            mouseY.set(clientY / innerHeight);

            // GSAP trail effect
            gsap.to('.cursor-trail', {
                x: clientX,
                y: clientY,
                duration: 0.8,
                ease: 'power2.out',
                stagger: 0.05
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Complex abstract paths for the "drawing" effect
    const paths = [
        "M10,10 C50,100 150,50 200,150 S350,200 400,100",
        "M50,300 C100,200 200,400 300,300 S500,100 600,200",
        "M600,50 C500,150 400,50 300,150 S100,200 50,100",
        "M200,500 C250,400 350,550 450,450 S650,300 700,400",
    ];

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-[#faf9f6] text-[#1a1a1a] z-0 pointer-events-none">
            {/* Grain Texture */}
            <div className="absolute inset-0 opacity-40 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-multiply" />

            {/* Cursor Trails */}
            {[...Array(3)].map((_, i) => (
                <div
                    key={`trail-${i}`}
                    className="cursor-trail fixed top-0 left-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2 z-0 mix-blend-multiply"
                />
            ))}

            {/* Abstract Animated Shapes */}
            <svg className="absolute inset-0 w-full h-full z-10" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" style={{ stopColor: "#D4AF37", stopOpacity: 1 }} />
                        <stop offset="100%" style={{ stopColor: "#f0e68c", stopOpacity: 1 }} />
                    </linearGradient>
                </defs>

                {paths.map((path, i) => (
                    <motion.path
                        key={i}
                        d={path}
                        fill="none"
                        stroke="url(#grad1)"
                        strokeWidth="1.5"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 0.8 }}
                        transition={{
                            duration: 8,
                            ease: "easeInOut",
                            delay: i * 0.5,
                            repeat: Infinity,
                            repeatType: "reverse",
                            repeatDelay: 0.5
                        }}
                        style={{
                            scale: 1.2,
                            x: useTransform(smoothMouseX, [0, 1], [-30 * (i + 1), 30 * (i + 1)]),
                            y: useTransform(smoothMouseY, [0, 1], [-30 * (i + 1), 30 * (i + 1)]),
                            rotate: useTransform(smoothMouseX, [0, 1], [-5, 5]),
                        }}
                    />
                ))}

                {/* Floating Circles */}
                {[...Array(8)].map((_, i) => (
                    <motion.circle
                        key={`c-${i}`}
                        cx={Math.random() * 100 + "%"}
                        cy={Math.random() * 100 + "%"}
                        r={Math.random() * 40 + 10}
                        fill="rgba(212, 175, 55, 0.05)"
                        initial={{ scale: 0 }}
                        animate={{
                            scale: [1, 1.5, 1],
                            opacity: [0.2, 0.5, 0.2],
                            x: [0, 40, 0],
                            y: [0, -40, 0],
                        }}
                        transition={{
                            duration: 8 + Math.random() * 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: i * 0.5
                        }}
                    />
                ))}
            </svg>
        </div>
    );
};
