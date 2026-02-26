import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Search, MapPin, Filter, Star, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const CATEGORIES = ['Photography', 'Venue', 'Catering', 'Entertainment', 'Decoration', 'Makeup'];

interface VendorType {
    id: string;
    name: string;
    category: string;
    rating: number;
    reviews: number;
    image: string;
    location: string;
    price: number;
    priceUnit?: string;
    tags: string[];
}

export default function BrowseVendors() {
    const [vendors, setVendors] = useState<VendorType[]>([]);
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState([0, 500000]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                const { data } = await api.get('vendors/public');
                const formatted = data.map((v: any) => {
                    const lowestPrice = v.packages?.length > 0
                        ? Math.min(...v.packages.map((p: any) => Number(p.price)))
                        : (v.avgBookingPrice ? Number(v.avgBookingPrice) : 5000);

                    return {
                        id: v.id,
                        name: v.businessName || 'Unknown Vendor',
                        category: (v.serviceCategories && v.serviceCategories.length > 0) ? v.serviceCategories[0] : 'Other',
                        rating: 4.8, // Default rating without review system
                        reviews: 10,
                        image: v.logoUrl || '/images/placeholder.jpg',
                        location: v.city ? `${v.city}, ${v.state || 'India'}` : 'Location NA',
                        price: lowestPrice,
                        priceUnit: '',
                        tags: v.serviceCategories || []
                    };
                });
                setVendors(formatted);
            } catch (err) {
                console.error("Failed to fetch vendors", err);
            } finally {
                setLoading(false);
            }
        };

        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor => {
        const matchesSearch = vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vendor.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory ? vendor.category === selectedCategory : true;
        const matchesPrice = vendor.price >= priceRange[0] && vendor.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesPrice;
    });

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Header */}
            <div className="bg-primary/5 pt-28 pb-12 border-b">
                <div className="container px-4 md:px-6">
                    <h1 className="text-3xl font-bold tracking-tight mb-4">Find the Perfect Vendor</h1>

                    <div className="flex flex-col md:flex-row gap-4 max-w-4xl">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or location..."
                                className="pl-10 h-12 bg-background text-base"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="relative flex-1 md:flex-none md:w-[240px]">
                            <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                            <Input placeholder="City" className="pl-10 h-12 bg-background text-base" />
                        </div>
                        <Button className="h-12 px-8 text-base">Search</Button>
                    </div>
                </div>
            </div>

            <main className="container px-4 md:px-6 py-8 flex-1">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 space-y-8">
                        <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <Filter className="h-4 w-4" /> Filters
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Category</label>
                                    <div className="space-y-2">
                                        {CATEGORIES.map(cat => (
                                            <div key={cat} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={cat}
                                                    checked={selectedCategory === cat}
                                                    onCheckedChange={(checked) => setSelectedCategory(checked ? cat : null)}
                                                />
                                                <label htmlFor={cat} className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                                    {cat}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t">
                                    <label className="text-sm font-medium mb-4 block">Price Range</label>
                                    <Slider
                                        defaultValue={[0, 500000]}
                                        max={500000}
                                        step={5000}
                                        value={priceRange}
                                        onValueChange={setPriceRange}
                                        className="mb-4"
                                    />
                                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                                        <span>₹{priceRange[0].toLocaleString()}</span>
                                        <span>₹{priceRange[1].toLocaleString()}+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-muted-foreground">
                                Showing <span className="font-medium text-foreground">{filteredVendors.length}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Sort by:</span>
                                <select className="bg-transparent text-sm font-medium outline-none cursor-pointer">
                                    <option>Recommended</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Rating</option>
                                </select>
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredVendors.map(vendor => (
                                    <Link key={vendor.id} to={`/vendor/${vendor.id}`}>
                                        <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow group">
                                            <div className="relative h-48 overflow-hidden bg-muted flex items-center justify-center">
                                                <img
                                                    src={vendor.image}
                                                    alt={vendor.name}
                                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=No+Logo';
                                                    }}
                                                />
                                                <div className="absolute top-3 right-3">
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white">
                                                        <Heart className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="absolute bottom-3 left-3">
                                                    <Badge variant="secondary" className="backdrop-blur-md bg-white/90">
                                                        {vendor.category}
                                                    </Badge>
                                                </div>
                                            </div>
                                            <CardContent className="p-4 space-y-3">
                                                <div>
                                                    <div className="flex justify-between items-start">
                                                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{vendor.name}</h3>
                                                        <div className="flex items-center gap-1 text-sm font-medium">
                                                            <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                                                            {vendor.rating}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                                                        <MapPin className="w-3 h-3" /> {vendor.location}
                                                    </div>
                                                </div>

                                                <p className="text-sm text-muted-foreground line-clamp-2">
                                                    Professional {vendor.category?.toLowerCase() || 'vendor'} services for your special day.
                                                </p>

                                                <div className="flex flex-wrap gap-1">
                                                    {vendor.tags.map((tag, i) => (
                                                        <span key={i} className="text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                <div className="pt-3 border-t mt-auto flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-muted-foreground">Starting from</p>
                                                        <p className="font-bold text-primary">
                                                            ₹{vendor.price.toLocaleString()}
                                                            {vendor.priceUnit && <span className="text-sm font-normal text-muted-foreground">{vendor.priceUnit}</span>}
                                                        </p>
                                                    </div>
                                                    <Button size="sm" variant="outline">View</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {!loading && filteredVendors.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="bg-muted p-4 rounded-full mb-4">
                                    <Search className="h-8 w-8 text-muted-foreground" />
                                </div>
                                <h3 className="text-lg font-semibold">No vendors found</h3>
                                <p className="text-muted-foreground">Try adjusting your filters or search query.</p>
                                <Button
                                    variant="link"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSelectedCategory(null);
                                        setPriceRange([0, 500000]);
                                    }}
                                >
                                    Clear all filters
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
