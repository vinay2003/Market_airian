import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Filter, Star, Heart, MapPin, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/lib/api';

const CITIES = [
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Ahmedabad',
    'Chennai', 'Kolkata', 'Surat', 'Pune', 'Jaipur',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane'
];

const CATEGORIES = [
    'Venue', 'Photographer', 'Videographer', 'Catering',
    'Makeup Artist', 'Decorator', 'Event Planner', 'DJ',
    'Mehndi Artist', 'Florist', 'Jewellery', 'Invitation'
];


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

    const [priceRange, setPriceRange] = useState([0, 500000]);
    const [searchQuery, setSearchQuery] = useState('');
    const [city, setCity] = useState('all');
    const [category, setCategory] = useState('all');

    const fetchVendors = async () => {
        try {
            setLoading(true);
            const queryParams: any = {
                page: '1',
                limit: '50'
            };

            if (searchQuery) queryParams.query = searchQuery;
            if (city !== 'all') queryParams.city = city;
            if (category !== 'all') queryParams.category = category;

            const params = new URLSearchParams(queryParams);

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
                    rating: v.rating || 0,
                    reviews: v.reviewsCount || 0,
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

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchVendors();
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, city, category]);

    const filteredVendors = vendors.filter(vendor => {
        return vendor.price >= priceRange[0] && vendor.price <= priceRange[1];
    });

    const clearFilters = () => {
        setPriceRange([0, 500000]);
        setSearchQuery('');
        setCity('all');
        setCategory('all');
    };

    return (
        <div className="min-h-screen bg-transparent flex flex-col">
            <main className="container px-4 md:px-6 pt-24 pb-12 flex-1">
                <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-6">
                    <div className="max-w-xl">
                        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 font-heading">
                            Find the Perfect <span className="text-primary italic">Vendors</span>
                        </h1>
                        <p className="text-muted-foreground mt-3 text-lg leading-relaxed">
                            Discover top-rated professionals for your special day
                        </p>
                    </div>
                </div>

                {/* Search and Quick Filters */}
                <div className="bg-white p-4 rounded-2xl shadow-md border mb-12 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Search by name, services or keywords..."
                            className="pl-10 h-12 border-none bg-muted/50 focus-visible:ring-primary transition-all text-lg"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-56">
                        <Select value={city} onValueChange={setCity}>
                            <SelectTrigger className="h-12 border-none bg-muted/50 text-base">
                                <MapPin className="h-4 w-4 mr-2 text-primary" />
                                <SelectValue placeholder="All Cities" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Cities</SelectItem>
                                {CITIES.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-full md:w-56">
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="h-12 border-none bg-muted/50 text-base">
                                <Filter className="h-4 w-4 mr-2 text-primary" />
                                <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map(c => (
                                    <SelectItem key={c} value={c}>{c}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={fetchVendors}
                        className="h-12 px-8 rounded-xl shadow-lg hover:shadow-primary/20 transition-all font-bold text-lg"
                    >
                        Search
                    </Button>
                </div>

                <div className="flex flex-col md:flex-row gap-8">
                    {/* Filters Sidebar */}
                    <aside className="w-full md:w-64 space-y-8">
                        <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2 text-primary">
                                <Filter className="h-4 w-4" /> Filters
                            </h3>

                            <div className="space-y-4">
                                <div className="pt-4">
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
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
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
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <h3 className="text-xl font-bold text-gray-900">No vendors matching your price</h3>
                                <p className="text-muted-foreground mt-2 max-w-sm">
                                    Try expanding your price range to see more professionals in your area.
                                </p>
                                <Button
                                    variant="outline"
                                    className="mt-6 rounded-full px-8"
                                    onClick={clearFilters}
                                >
                                    Clear Price Filter
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
