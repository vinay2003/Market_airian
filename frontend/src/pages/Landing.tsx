import Navbar from '@/components/home/Navbar';
import Hero from '@/components/home/Hero';
import Categories from '@/components/home/Categories';
import FeaturedShowcase from '@/components/home/FeaturedShowcase';
import Testimonials from '@/components/home/Testimonials';
import Gallery from '@/components/home/Gallery';
import Footer from '@/components/home/Footer';

export default function Landing() {
    return (
        <div className="min-h-screen bg-background font-sans text-foreground overflow-hidden">
            <Navbar />
            <main>
                <Hero />
                <Categories />
                <FeaturedShowcase />
                <Testimonials />
                <Gallery />
            </main>
            <Footer />
        </div>
    );
}
