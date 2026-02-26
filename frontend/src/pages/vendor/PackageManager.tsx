import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface PackageType {
    id: string;
    name: string;
    description: string;
    price: string | number;
    features: string[];
    images?: string[];
}

export default function PackageManager() {
    const { toast } = useToast();
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');
    const [usdAmount, setUsdAmount] = useState('');
    const [exchangeRate, setExchangeRate] = useState<number>(83); // fallback

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        features: '',
        existingImages: [] as string[]
    });

    const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        fetchPackages();
        fetchExchangeRate();

        const params = new URLSearchParams(window.location.search);
        if (params.get('create') === 'true') {
            setIsDialogOpen(true);
        }
    }, []);

    const fetchPackages = async () => {
        try {
            setFetching(true);
            const { data } = await api.get('vendors/profile');
            if (data?.packages) {
                setPackages(data.packages);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load packages.", variant: "destructive" });
        } finally {
            setFetching(false);
        }
    };

    const fetchExchangeRate = async () => {
        try {
            const res = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
            const data = await res.json();
            if (data?.rates?.INR) {
                setExchangeRate(data.rates.INR);
            }
        } catch (error) {
            console.error('Failed to fetch exchange rate, using fallback', error);
        }
    };

    const handleUsdChange = (val: string) => {
        setUsdAmount(val);
        if (val) {
            const converted = Math.round(parseFloat(val) * exchangeRate);
            setFormData(prev => ({ ...prev, price: converted.toString() }));
        } else {
            setFormData(prev => ({ ...prev, price: '' }));
        }
    };

    const handleOpenDialog = (pkg?: PackageType) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                name: pkg.name,
                description: pkg.description,
                price: pkg.price.toString(),
                features: pkg.features.join(', '),
                existingImages: pkg.images || []
            });
            setCurrency('INR');
            setUsdAmount('');
        } else {
            setEditingPackage(null);
            setFormData({ name: '', description: '', price: '', features: '', existingImages: [] });
            setCurrency('INR');
            setUsdAmount('');
        }
        setFilesToUpload([]);
        setPreviewUrls([]);
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this package?")) {
            try {
                await api.delete(`vendors/packages/${id}`);
                setPackages(packages.filter(p => p.id !== id));
                toast({ title: "Package Deleted" });
            } catch (error) {
                toast({ title: "Error", description: "Could not delete package.", variant: "destructive" });
            }
        }
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.description) {
            toast({ title: "Validation Error", description: "Please fill required fields.", variant: "destructive" });
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('features', formData.features);

        formData.existingImages.forEach(img => {
            data.append('existingImages', img);
        });

        filesToUpload.forEach(f => {
            data.append('images', f);
        });

        try {
            if (editingPackage) {
                await api.patch(`vendors/packages/${editingPackage.id}`, data);
                toast({ title: "Package Updated" });
            } else {
                await api.post('vendors/packages', data);
                toast({ title: "Package Created" });
            }
            setIsDialogOpen(false);
            fetchPackages();
        } catch (error) {
            toast({ title: "Error", description: "Failed to save package.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const removeExistingImage = (idx: number) => {
        setFormData(prev => ({
            ...prev,
            existingImages: prev.existingImages.filter((_, i) => i !== idx)
        }));
    };

    const removeNewImage = (idx: number) => {
        setFilesToUpload(prev => prev.filter((_, i) => i !== idx));
        setPreviewUrls(prev => prev.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Packages</h1>
                    <p className="text-muted-foreground">Manage your service offerings and pricing.</p>
                </div>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Package
                </Button>
            </div>

            {fetching ? (
                <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {packages.map((pkg) => (
                        <Card key={pkg.id} className="flex flex-col">
                            {pkg.images && pkg.images.length > 0 ? (
                                <div className="h-48 w-full overflow-hidden rounded-t-lg relative bg-muted flex items-center justify-center group-hover:opacity-90 transition-opacity">
                                    {(pkg.images[0].match(/\.(mp4|webm|mov)$/i)) ? (
                                        <video src={pkg.images[0]} className="w-full h-full object-cover" controls playsInline />
                                    ) : (
                                        <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" />
                                    )}
                                    {pkg.images.length > 1 && (
                                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-full drop-shadow">
                                            +{pkg.images.length - 1} Media
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="h-48 w-full bg-muted flex flex-col items-center justify-center rounded-t-lg relative">
                                    <Package className="h-8 w-8 text-muted-foreground mb-2" />
                                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">No Image</span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className="flex justify-between items-start">
                                    <span>{pkg.name}</span>
                                    <span className="text-xl font-bold text-primary">₹{pkg.price}</span>
                                </CardTitle>
                                <CardDescription className="line-clamp-2 min-h-[40px]">
                                    {pkg.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-1">
                                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                                    {pkg.features.map((feature, i) => (
                                        <li key={i}>{feature}</li>
                                    ))}
                                </ul>
                            </CardContent>
                            <div className="p-6 pt-0 flex gap-2">
                                <Button variant="outline" className="flex-1" onClick={() => handleOpenDialog(pkg)}>
                                    <Pencil className="mr-2 h-4 w-4" /> Edit
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:bg-red-50" onClick={() => handleDelete(pkg.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </Card>
                    ))}

                    {packages.length === 0 && (
                        <div className="col-span-full flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg bg-muted/10">
                            <Package className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold">No packages yet</h3>
                            <p className="text-muted-foreground mb-4">Create your first package to start selling.</p>
                            <Button onClick={() => handleOpenDialog()}>Create Package</Button>
                        </div>
                    )}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPackage ? 'Edit Package' : 'Create Package'}</DialogTitle>
                        <DialogDescription>
                            Define the details of your service package.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Package Name *</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Gold Tier"
                            />
                        </div>
                        <div className="grid gap-2">
                            <div className="flex justify-between">
                                <Label htmlFor="price">Price *</Label>
                                <div className="space-x-2">
                                    <button type="button" onClick={() => setCurrency('INR')} className={`text-xs ${currency === 'INR' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>INR</button>
                                    <button type="button" onClick={() => setCurrency('USD')} className={`text-xs ${currency === 'USD' ? 'font-bold text-primary' : 'text-muted-foreground'}`}>USD</button>
                                </div>
                            </div>
                            {currency === 'INR' ? (
                                <Input
                                    id="price"
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="Amount in ₹"
                                />
                            ) : (
                                <div className="space-y-1">
                                    <Input
                                        id="price-usd"
                                        type="number"
                                        value={usdAmount}
                                        onChange={(e) => handleUsdChange(e.target.value)}
                                        placeholder="Amount in $"
                                    />
                                    {formData.price && (
                                        <p className="text-sm text-muted-foreground">
                                            Approx: ₹{formData.price} (Rate: 1 USD = ₹{exchangeRate})
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="features">Features (comma separated) *</Label>
                            <Input
                                id="features"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                placeholder="Feature 1, Feature 2, Feature 3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what's included..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Package Media (Images & Video)</Label>
                            <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center cursor-pointer hover:bg-primary/5 transition-colors relative group">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files) return;
                                        const validFiles: File[] = [];
                                        for (const file of Array.from(files)) {
                                            if (file.size > 50 * 1024 * 1024) {
                                                toast({ title: "File too large", description: `${file.name} exceeds 50MB max`, variant: "destructive" });
                                                continue;
                                            }
                                            validFiles.push(file);
                                        }
                                        const newUrls = validFiles.map(f => URL.createObjectURL(f));
                                        setFilesToUpload(prev => [...prev, ...validFiles]);
                                        setPreviewUrls(prev => [...prev, ...newUrls]);
                                        // Reset input so the same files can be uploaded again if removed
                                        e.target.value = '';
                                    }}
                                />
                                <div className="flex flex-col items-center gap-3 text-muted-foreground pointer-events-none">
                                    <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors">
                                        <Upload className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="font-medium text-foreground">Click or drag multiple files here</p>
                                        <p className="text-xs">Supports Images & Videos (Max 50MB per file)</p>
                                    </div>
                                </div>
                            </div>

                            {/* Previews */}
                            {(formData.existingImages.length > 0 || previewUrls.length > 0) && (
                                <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 mt-4">
                                    {formData.existingImages.map((url, i) => (
                                        <div key={`existing-${i}`} className="aspect-square rounded-lg overflow-hidden border relative group shadow-sm">
                                            <img src={url} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="Uploaded package media" />
                                            <button
                                                className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                                                onClick={(e) => { e.preventDefault(); removeExistingImage(i); }}
                                                title="Remove existing media"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                    {previewUrls.map((url, i) => (
                                        <div key={`new-${i}`} className="aspect-square rounded-lg overflow-hidden border relative group shadow-sm bg-muted flex items-center justify-center">
                                            {url.match(/\.(mp4|webm)$/i) || filesToUpload[i]?.type.startsWith('video/') ? (
                                                <video src={url} className="h-full w-full object-cover" />
                                            ) : (
                                                <img src={url} className="h-full w-full object-cover transition-transform group-hover:scale-105" alt="New package media" />
                                            )}
                                            {filesToUpload[i]?.type.startsWith('video/') && (
                                                <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10">
                                                    <span className="text-[10px] bg-black/60 text-white px-2 py-1 rounded font-medium absolute bottom-1 right-1">VIDEO</span>
                                                </div>
                                            )}
                                            <button
                                                className="absolute top-1 right-1 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 hover:scale-100"
                                                onClick={(e) => { e.preventDefault(); removeNewImage(i); }}
                                                title="Remove new media"
                                            >
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={loading}>Cancel</Button>
                        <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Saving...' : 'Save Package'}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
