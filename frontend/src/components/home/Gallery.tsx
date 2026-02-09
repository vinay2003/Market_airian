import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

const images = [
    { src: "https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=1974&auto=format&fit=crop", span: "md:col-span-2 md:row-span-2" },
    { src: "https://images.unsplash.com/photo-1519225421980-715cb0202128?q=80&w=2000&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=2070&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?q=80&w=2070&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
    { src: "https://images.unsplash.com/photo-1530103862676-de3c9fa59af7?q=80&w=2070&auto=format&fit=crop", span: "md:col-span-1 md:row-span-1" },
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

                <div className="grid md:grid-cols-4 md:grid-rows-2 gap-4 h-[600px] md:h-[800px]">
                    {images.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`relative rounded-3xl overflow-hidden group ${img.span}`}
                        >
                            <img
                                src={img.src}
                                alt="Gallery"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
