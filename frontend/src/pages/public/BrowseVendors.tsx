import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
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
    const [cityQuery, setCityQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [priceRange, setPriceRange] = useState([0, 500000]);

    useEffect(() => {
        const fetchVendors = async () => {
            try {
                setLoading(true);
                const params = new URLSearchParams({
                    page: '1',
                    limit: '50',
                    ...(searchQuery && { query: searchQuery }),
                    ...(selectedCategory && selectedCategory !== 'all' && { category: selectedCategory }),
                    ...(cityQuery && { city: cityQuery })
                });

                const res = await api.get(`vendors/public?${params.toString()}`);
                const vendorsList = res.data.data || [];
                const formatted = vendorsList.map((v: any) => {
                    let lowestPrice = 10000;
                    if (v.packages && v.packages.length > 0) {
                        lowestPrice = Math.min(...v.packages.map((p: any) => Number(p.price)));
                    } else if (v.avgBookingPrice) {
                        if (v.avgBookingPrice === 'low') lowestPrice = 5000;
                        else if (v.avgBookingPrice === 'medium') lowestPrice = 25000;
                        else if (v.avgBookingPrice === 'high') lowestPrice = 75000;
                        else if (v.avgBookingPrice === 'premium') lowestPrice = 150000;
                        else lowestPrice = Number(v.avgBookingPrice) || 10000;
                    }

                    const coverImage = v.bannerUrl || v.logoUrl ||
                        (v.gallery && v.gallery.length > 0 ? v.gallery[0].url : null) ||
                        (v.packages && v.packages.find((p: any) => p.images && p.images.length > 0)?.images[0]) ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(v.businessName || 'Vendor')}&background=random&size=400&font-size=0.33`;

                    return {
                        id: v.id,
                        name: v.businessName || 'Unknown Vendor',
                        category: (v.serviceCategories && v.serviceCategories.length > 0) ? v.serviceCategories[0] : 'Other',
                        rating: 4.8,
                        reviews: Math.floor(Math.random() * 50) + 5,
                        image: coverImage,
                        location: v.city ? `${v.city}, India` : 'India',
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

        const timer = setTimeout(() => {
            fetchVendors();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, selectedCategory, cityQuery]);

    const filteredVendors = vendors.filter(vendor => {
        return vendor.price >= priceRange[0] && vendor.price <= priceRange[1];
    });

    const clearFilters = () => {
        setSearchQuery('');
        setCityQuery('');
        setSelectedCategory(null);
        setPriceRange([0, 500000]);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Improved Header Search */}
            <div className="bg-primary/5 pt-28 pb-12 border-b">
                <div className="container px-4 md:px-6">
                    <div className="max-w-4xl space-y-4">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900 font-heading">
                            Find the Perfect <span className="text-primary">Vendors</span>
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-2xl mb-6">
                            Search thousands of verified wedding and event professionals by name, category, or location.
                        </p>

                        <div className="bg-white p-2 md:p-3 rounded-2xl shadow-xl shadow-primary/5 flex flex-col md:flex-row gap-2 border">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Search by name, type, or service..."
                                    className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 text-base"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>

                            <div className="md:w-px h-8 bg-gray-200 hidden md:block my-auto" />

                            <div className="relative flex-1 md:w-[200px]">
                                <MapPin className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                                <Input
                                    placeholder="Any City"
                                    className="pl-10 h-12 border-none shadow-none focus-visible:ring-0 text-base"
                                    value={cityQuery}
                                    onChange={(e) => setCityQuery(e.target.value)}
                                />
                            </div>

                            <div className="md:w-px h-8 bg-gray-200 hidden md:block my-auto" />

                            <div className="relative flex-1 md:w-[200px]">
                                <Select
                                    value={selectedCategory || 'all'}
                                    onValueChange={(val) => setSelectedCategory(val === 'all' ? null : val)}
                                >
                                    <SelectTrigger className="h-12 border-none shadow-none focus:ring-0 text-base pl-3">
                                        <SelectValue placeholder="All Categories" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Categories</SelectItem>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button className="h-12 px-8 text-base rounded-xl font-semibold shadow-lg shadow-primary/20">
                                Search
                            </Button>
                        </div>
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
                                                        const target = e.target as HTMLImageElement;
                                                        if (!target.src.includes('ui-avatars.com')) {
                                                            target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(vendor.name)}&background=random&size=400`;
                                                        }
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
                                    onClick={clearFilters}
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
