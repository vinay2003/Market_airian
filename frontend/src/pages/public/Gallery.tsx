import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Image as ImageIcon, Heart, Sparkles } from 'lucide-react';
import { BRAND } from '@/lib/constants';

const CATEGORIES = ['All', 'Weddings', 'Birthdays', 'Corporate', 'Mehendi'];

const GALLERY_IMAGES = [
    { id: 1, src: "/images/WhatsApp Image 2026-02-10 at 22.00.18.jpeg", category: "Weddings", span: "md:col-span-2 md:row-span-2" },
    { id: 2, src: "/images/WhatsApp Image 2026-02-10 at 22.00.19.jpeg", category: "Birthdays", span: "md:col-span-1 md:row-span-1" },
    { id: 3, src: "/images/WhatsApp Image 2026-02-10 at 22.00.20.jpeg", category: "Weddings", span: "md:col-span-1 md:row-span-1" },
    { id: 4, src: "/images/WhatsApp Image 2026-02-10 at 22.00.21.jpeg", category: "Corporate", span: "md:col-span-1 md:row-span-1" },
    { id: 5, src: "/images/WhatsApp Image 2026-02-10 at 22.00.23.jpeg", category: "Mehendi", span: "md:col-span-1 md:row-span-2" },
    { id: 6, src: "/images/WhatsApp Image 2026-02-10 at 21.59.51.jpeg", category: "Weddings", span: "md:col-span-2 md:row-span-1" },
];

export default function GalleryPage() {
    const [activeTab, setActiveTab] = useState('All');

    const filteredImages = activeTab === 'All'
        ? GALLERY_IMAGES
        : GALLERY_IMAGES.filter(img => img.category === activeTab);

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            {/* Header */}
            <header className="max-w-4xl mx-auto px-6 text-center mb-16 space-y-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold tracking-wide"
                >
                    <ImageIcon className="w-4 h-4" aria-hidden="true" />
                    Portfolio
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-gray-900 drop-shadow-sm"
                >
                    Captured <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-indigo-600">Moments</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-light"
                >
                    Explore our curated gallery of beautiful celebrations, crafted by {BRAND.name}'s verified vendors.
                </motion.p>
            </header>

            <div className="max-w-7xl mx-auto px-6">
                {/* Filters */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-12"
                >
                    {CATEGORIES.map(category => (
                        <button
                            key={category}
                            onClick={() => setActiveTab(category)}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 ${activeTab === category
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20 scale-105'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </motion.div>

                {/* Masonry-Style Grid */}
                <motion.div
                    layout
                    className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 auto-rows-[250px] gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {filteredImages.map((img) => (
                            <motion.div
                                key={img.id}
                                layout
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.4 }}
                                className={`relative rounded-3xl overflow-hidden group shadow-sm bg-white border border-gray-100 ${img.span.replace('md:col-span-2', 'md:col-span-2 lg:col-span-2').replace('md:row-span-2', 'row-span-2')}`}
                            >
                                <img
                                    src={img.src}
                                    alt={`${img.category} event`}
                                    className="w-full h-full object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-110"
                                    loading="lazy"
                                />

                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Hover content */}
                                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-between">
                                    <div>
                                        <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-semibold mb-2">
                                            <Sparkles className="w-3 h-3" />
                                            {img.category}
                                        </div>
                                    </div>
                                    <button className="bg-white/20 hover:bg-white text-white hover:text-gray-900 backdrop-blur-md p-2.5 rounded-full transition-colors">
                                        <Heart className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>

                {filteredImages.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Camera className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-xl font-medium text-gray-900 mb-2">No photos found</h3>
                        <p>We are still adding photos to this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
