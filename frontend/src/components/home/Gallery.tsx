import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const images = [
    { src: "/images/WhatsApp Image 2026-02-10 at 22.00.18.jpeg", span: "md:col-span-2 md:row-span-2" },
    { src: "/images/WhatsApp Image 2026-02-10 at 22.00.19.jpeg", span: "md:col-span-1 md:row-span-1" },
    { src: "/images/WhatsApp Image 2026-02-10 at 22.00.20.jpeg", span: "md:col-span-1 md:row-span-1" },
    { src: "/images/WhatsApp Image 2026-02-10 at 22.00.21.jpeg", span: "md:col-span-1 md:row-span-1" },
    { src: "/images/WhatsApp Image 2026-02-10 at 22.00.23.jpeg", span: "md:col-span-1 md:row-span-1" },
];

export default function Gallery() {
    return (
        <section className="py-24 bg-white" id="gallery">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col items-center text-center mb-16 space-y-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-full">
                        <Camera className="h-6 w-6" />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-heading font-bold text-gray-900">Captured Moments</h2>
                    <p className="text-gray-500 max-w-xl mx-auto">Real weddings, real parties, real memories created by our vendors.</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 grid-rows-4 md:grid-rows-2 gap-3 h-[500px] md:h-[600px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-2xl overflow-hidden group ${i === 0 ? 'col-span-2 row-span-2' : 'col-span-1 row-span-1'}`}
                        >
                            <img
                                src={img.src}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
