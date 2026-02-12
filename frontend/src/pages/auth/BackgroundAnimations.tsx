import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export const BackgroundAnimations = () => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            const orbs = document.querySelectorAll('.orb');

            // Random floating animation
            orbs.forEach((orb, i) => {
                gsap.to(orb, {
                    x: "random(-50, 50, 5)",
                    y: "random(-50, 50, 5)",
                    scale: "random(0.8, 1.2)",
                    duration: "random(10, 20)",
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    opacity: "random(0.3, 0.6)",
                    delay: i * 2
                });
            });

            // Parallax mouse effect
            const handleMouseMove = (e: MouseEvent) => {
                const { clientX, clientY } = e;
                const sw = window.innerWidth;
                const sh = window.innerHeight;
                const x = (clientX - sw / 2) / sw;
                const y = (clientY - sh / 2) / sh;

                orbs.forEach((orb, i) => {
                    const factor = (i + 1) * 20; // Different depth for each orb
                    gsap.to(orb, {
                        x: `+=${x * factor}`,
                        y: `+=${y * factor}`,
                        duration: 1,
                        ease: "power2.out",
                        overwrite: "auto"
                    });
                });
            };

            window.addEventListener('mousemove', handleMouseMove);

            return () => {
                window.removeEventListener('mousemove', handleMouseMove);
            };
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-slate-950">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />

            {/* Animated Orbs */}
            <div className="orb absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] rounded-full bg-purple-900/20 blur-[100px]" />
            <div className="orb absolute top-[20%] right-[-10%] w-[40vh] h-[40vh] rounded-full bg-blue-900/20 blur-[100px]" />
            <div className="orb absolute bottom-[-10%] left-[20%] w-[60vh] h-[60vh] rounded-full bg-indigo-900/10 blur-[120px]" />

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        </div>
    );
};
