import { motion } from 'framer-motion';
import { Sparkles, PartyPopper, Cake, Music, Camera, Utensils } from 'lucide-react';
import { Card } from '@/components/ui/card';

const categories = [
    { name: 'Weddings', icon: Sparkles, color: 'bg-rose-100 text-rose-600', desc: 'Venues, planners, photographers' },
    { name: 'Birthdays', icon: Cake, color: 'bg-blue-100 text-blue-600', desc: 'Decor, cakes, entertainers' },
    { name: 'Corporate', icon: PartyPopper, color: 'bg-amber-100 text-amber-600', desc: 'Conferences, retreats, parties' },
    { name: 'Music & DJs', icon: Music, color: 'bg-purple-100 text-purple-600', desc: 'Live bands, DJs, sound systems' },
    { name: 'Photography', icon: Camera, color: 'bg-emerald-100 text-emerald-600', desc: 'Wedding shoots, portraits' },
    { name: 'Catering', icon: Utensils, color: 'bg-orange-100 text-orange-600', desc: 'Buffets, sit-down dinners' },
];

export default function Categories() {
    return (
        <section className="section-padding bg-secondary/30 relative" id="services">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

            <div className="max-w-7xl mx-auto container-padding relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-10 md:mb-16 space-y-4"
                >
                    <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900">Curated Categories</h2>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">Everything you need to plan the perfect celebration, organized for your convenience.</p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
                    {categories.map((cat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="h-full"
                        >
                            <Card className="h-full border-0 shadow-sm hover:shadow-xl transition-all duration-300 p-4 md:p-6 flex flex-col items-center text-center bg-white/60 backdrop-blur-sm cursor-pointer group">
                                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${cat.color}`}>
                                    <cat.icon className="h-6 w-6 md:h-7 md:w-7" />
                                </div>
                                <h3 className="font-heading font-bold text-base md:text-lg mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-[10px] md:text-xs text-gray-500 line-clamp-2">{cat.desc}</p>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
