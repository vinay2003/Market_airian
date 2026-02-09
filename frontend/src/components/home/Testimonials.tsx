import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

const testimonials = [
    {
        name: "Sarah & James",
        role: "Wedding Clients",
        text: "The most seamless experience! We found our dream photographer and venue within days. The platform is elegant and so easy to use.",
        image: "https://images.unsplash.com/photo-1623184663110-89ba5b565eb6?q=80&w=2070&auto=format&fit=crop"
    },
    {
        name: "Event Horizon Co.",
        role: "Corporate Vendor",
        text: "Since listing on MarketFly, our bookings have doubled. The quality of leads is outstanding compared to other platforms.",
        image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1974&auto=format&fit=crop"
    },
    {
        name: "Priya Sharma",
        role: "Birthday Planner",
        text: "I planned my daughter's first birthday entirely through this site. The verified vendors gave me such peace of mind.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1976&auto=format&fit=crop"
    }
];

export default function Testimonials() {
    return (
        <section className="py-24 bg-secondary/20 relative overflow-hidden" id="testimonials">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-5 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900 mb-4">Love Stories</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Hear from the people who made their dreams come true with us.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.2 }}
                            className="bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-sm border border-white/40 flex flex-col relative"
                        >
                            <Quote className="h-10 w-10 text-primary/20 absolute top-6 right-6" />

                            <div className="flex gap-1 text-primary mb-6">
                                {[1, 2, 3, 4, 5].map(star => <Star key={star} className="h-4 w-4 fill-current" />)}
                            </div>

                            <p className="text-gray-600 italic mb-8 flex-grow leading-relaxed">"{t.text}"</p>

                            <div className="flex items-center gap-4">
                                <img src={t.image} alt={t.name} className="h-12 w-12 rounded-full object-cover border-2 border-primary/20" />
                                <div>
                                    <div className="font-bold text-gray-900">{t.name}</div>
                                    <div className="text-xs text-primary font-medium">{t.role}</div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
