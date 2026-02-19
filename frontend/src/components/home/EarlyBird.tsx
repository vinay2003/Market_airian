import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

// --- Countdown Timer Component ---
const CountdownTimer = () => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + 2); // 2 days from now

        const interval = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60)
                });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex gap-4 justify-center py-6">
            {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[80px] border border-white/20">
                    <span className="text-3xl font-bold font-mono text-yellow-400">
                        {value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs text-uppercase tracking-wider opacity-80 uppercase">{unit}</span>
                </div>
            ))}
        </div>
    );
};

// --- Slots Counter Component ---
const SlotsCounter = () => {
    const target = 472; // Slots filled
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Simple fast increment for basic visual feedback without complex physics
        const duration = 1000;
        const steps = 20;
        const increment = target / steps;
        const speed = duration / steps;

        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(Math.floor(current));
            }
        }, speed);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="mt-4">
            <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Slots Filled</span>
                <span className="text-yellow-400 font-mono">{count} / 500</span>
            </div>
            <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/10">
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full"
                    style={{ width: `${(count / 500) * 100}%` }}
                />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">Only {500 - count} spots remaining!</p>
        </div>
    );
};

export default function EarlyBird() {
    return (
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>

            {/* Floating Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div
                    className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl"
                />
                <div
                    className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"
                />
            </div>

            <div className="container px-4 md:px-6 relative z-10 text-center space-y-8">
                <div className="inline-block">
                    <span className="bg-yellow-400 text-indigo-900 font-bold px-4 py-1.5 rounded-full text-sm uppercase tracking-wider mb-4 inline-block shadow-lg">
                        Early Bird Offer
                    </span>
                </div>

                <h2 className="text-4xl md:text-5xl font-heading font-bold mb-2 leading-tight">
                    Be Among the First 500 Vendors. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">
                        Get 50% Launch Discount
                    </span>
                </h2>

                <CountdownTimer />

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto my-12 text-left">
                    {[
                        { title: "0% Commission", desc: "Keep 100% of what you earn on all bookings. No hidden fees.", color: "text-yellow-300" },
                        { title: "Founding Member Badge", desc: "Exclusive profile badge to standout and build trust instantly.", color: "text-yellow-300" },
                        { title: "Premium Visibility", desc: "Secure top spots in search results before the market gets crowded.", color: "text-yellow-300" }
                    ].map((card, idx) => (
                        <div
                            key={idx}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
                        >
                            <h3 className={`text-xl font-bold mb-2 ${card.color}`}>{card.title}</h3>
                            <p className="text-gray-200">{card.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 p-8 rounded-3xl max-w-3xl mx-auto border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                    <p className="text-xl md:text-2xl font-light mb-8 italic">
                        "Whether you run a banquet hall, photography studio, catering service, or décor business — <strong className="font-bold text-white not-italic">Airion helps you scale faster.</strong>"
                    </p>

                    <div className="max-w-md mx-auto">
                        <SlotsCounter />

                        <div className="mt-8">
                            <Link to="/vendor/onboarding">
                                <div className="inline-block">
                                    <Button size="lg" className="bg-yellow-400 text-indigo-900 hover:bg-yellow-300 font-bold text-lg px-10 h-16 rounded-full shadow-xl transition-all w-full md:w-auto relative overflow-hidden group">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Secure Your Spot Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                                    </Button>
                                </div>
                            </Link>
                            <p className="text-sm text-gray-400 mt-3">
                                Launch Offer Ends Soon!
                            </p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70">
                    <div className="text-center">
                        <h4 className="text-3xl font-bold mb-1">500+</h4>
                        <p className="text-sm">Vendors Joined</p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-3xl font-bold mb-1">0%</h4>
                        <p className="text-sm">Commission Fee</p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-3xl font-bold mb-1">10x</h4>
                        <p className="text-sm">Reach Increase</p>
                    </div>
                    <div className="text-center">
                        <h4 className="text-3xl font-bold mb-1">24/7</h4>
                        <p className="text-sm">Support Team</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
