import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useCountdown } from '@/hooks/useCountdown';

/**
 * A stable launch deadline — stored as a module-level constant so it
 * does NOT reset to "now + 2 days" every time the page reloads.
 * Change this to your actual launch date.
 */
const LAUNCH_DEADLINE = new Date('2026-03-15T23:59:59');
const SLOTS_TOTAL = 500;
const SLOTS_FILLED = 472;

// --- Countdown Timer Component ---
const CountdownTimer = () => {
    const timeLeft = useCountdown(LAUNCH_DEADLINE);

    return (
        <div className="flex gap-4 justify-center py-6" aria-label="Time remaining until offer ends" aria-live="polite">
            {(Object.entries(timeLeft) as [string, number][]).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-3 min-w-[80px] border border-white/20">
                    <span className="text-3xl font-bold font-mono text-yellow-400">
                        {value.toString().padStart(2, '0')}
                    </span>
                    <span className="text-xs tracking-wider opacity-80 uppercase">{unit}</span>
                </div>
            ))}
        </div>
    );
};

// --- Slots Counter Component ---
const SlotsCounter = () => {
    const percentage = useMemo(() => (SLOTS_FILLED / SLOTS_TOTAL) * 100, []);

    return (
        <div className="mt-4">
            <div className="flex justify-between text-sm mb-2 font-medium">
                <span>Slots Filled</span>
                <span className="text-yellow-400 font-mono">{SLOTS_FILLED} / {SLOTS_TOTAL}</span>
            </div>
            <div
                className="h-3 w-full bg-white/10 rounded-full overflow-hidden border border-white/10"
                role="progressbar"
                aria-valuenow={SLOTS_FILLED}
                aria-valuemin={0}
                aria-valuemax={SLOTS_TOTAL}
                aria-label="Early bird spots filled"
            >
                <div
                    className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full transition-all duration-700"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            <p className="text-xs text-gray-400 mt-2 text-right">Only {SLOTS_TOTAL - SLOTS_FILLED} spots remaining!</p>
        </div>
    );
};

const benefits = [
    { title: '0% Commission', desc: 'Keep 100% of what you earn on all bookings. No hidden fees.', color: 'text-yellow-300' },
    { title: 'Founding Member Badge', desc: 'Exclusive profile badge to standout and build trust instantly.', color: 'text-yellow-300' },
    { title: 'Premium Visibility', desc: 'Secure top spots in search results before the market gets crowded.', color: 'text-yellow-300' },
];

const stats = [
    { value: '500+', label: 'Vendors Joined' },
    { value: '0%', label: 'Commission Fee' },
    { value: '10x', label: 'Reach Increase' },
    { value: '24/7', label: 'Support Team' },
];

export default function EarlyBird() {
    return (
        <section className="section-padding bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" aria-hidden="true" />

            {/* Floating decorative elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none" aria-hidden="true">
                <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl" />
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
                    {benefits.map((card) => (
                        <div
                            key={card.title}
                            className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-lg"
                        >
                            <h3 className={`text-xl font-bold mb-2 ${card.color}`}>{card.title}</h3>
                            <p className="text-gray-200">{card.desc}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-white/5 p-8 rounded-3xl max-w-3xl mx-auto border border-white/10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400" aria-hidden="true" />
                    <p className="text-xl md:text-2xl font-light mb-8 italic">
                        "Whether you run a banquet hall, photography studio, catering service, or décor business — <strong className="font-bold text-white not-italic">Airion helps you scale faster.</strong>"
                    </p>

                    <div className="max-w-md mx-auto">
                        <SlotsCounter />

                        <div className="mt-8">
                            <Link to="/vendor/onboarding">
                                <Button size="lg" className="bg-yellow-400 text-indigo-900 hover:bg-yellow-300 font-bold text-lg px-10 h-16 rounded-full shadow-xl transition-all w-full md:w-auto relative overflow-hidden group">
                                    <span className="relative z-10 flex items-center gap-2">
                                        Secure Your Spot Today <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                                    </span>
                                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" aria-hidden="true" />
                                </Button>
                            </Link>
                            <p className="text-sm text-gray-400 mt-3">Launch Offer Ends Soon!</p>
                        </div>
                    </div>
                </div>

                <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 opacity-70" aria-label="Platform statistics">
                    {stats.map(({ value, label }) => (
                        <div key={label} className="text-center">
                            <h4 className="text-3xl font-bold mb-1">{value}</h4>
                            <p className="text-sm">{label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
