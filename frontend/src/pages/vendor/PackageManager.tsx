import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, Package, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface PackageType {
    id: string;
    name: string;
    description: string;
    price: string;
    features: string[];
    images?: string[]; // URLs of images/videos
}

// Mock data
const INITIAL_PACKAGES: PackageType[] = [
    {
        id: '1',
        name: 'Basic Photography',
        description: '4 hours of coverage, 200 edited photos.',
        price: '25000',
        features: ['4 Hours Coverage', '200 Photos', 'Digital Album']
    },
    {
        id: '2',
        name: 'Premium Wedding',
        description: 'Full day coverage, drone shots, cinematic video.',
        price: '85000',
        features: ['Full Day', 'Drone Shots', 'Cinematic Video', 'Physical Album']
    }
];

export default function PackageManager() {
    const { toast } = useToast();
    const [packages, setPackages] = useState<PackageType[]>(INITIAL_PACKAGES);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        features: '',
        images: [] as string[]
    });

    const handleOpenDialog = (pkg?: PackageType) => {
        if (pkg) {
            setEditingPackage(pkg);
            setFormData({
                name: pkg.name,
                description: pkg.description,
                price: pkg.price,
                features: pkg.features.join(', '),
                images: pkg.images || []
            });
        } else {
            setEditingPackage(null);
            setFormData({ name: '', description: '', price: '', features: '', images: [] });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this package?")) {
            setPackages(packages.filter(p => p.id !== id));
            toast({ title: "Package Deleted" });
        }
    };

    const handleSubmit = () => {
        const newPackage: PackageType = {
            id: editingPackage ? editingPackage.id : Date.now().toString(),
            name: formData.name,
            description: formData.description,
            price: formData.price,
            features: formData.features.split(',').map(f => f.trim()).filter(f => f),
            images: formData.images
        };

        if (editingPackage) {
            setPackages(packages.map(p => p.id === editingPackage.id ? newPackage : p));
            toast({ title: "Package Updated" });
        } else {
            setPackages([...packages, newPackage]);
            toast({ title: "Package Created" });
        }
        setIsDialogOpen(false);
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

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {packages.map((pkg) => (
                    <Card key={pkg.id} className="flex flex-col">
                        {pkg.images && pkg.images.length > 0 && (
                            <div className="h-48 w-full overflow-hidden rounded-t-lg relative">
                                <img src={pkg.images[0]} alt={pkg.name} className="w-full h-full object-cover" />
                                {pkg.images.length > 1 && (
                                    <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
                                        +{pkg.images.length - 1} more
                                    </div>
                                )}
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

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingPackage ? 'Edit Package' : 'Create Package'}</DialogTitle>
                        <DialogDescription>
                            Define the details of your service package.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Package Name</Label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Gold Tier"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (₹)</Label>
                            <Input
                                id="price"
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="5000"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="features">Features (comma separated)</Label>
                            <Input
                                id="features"
                                value={formData.features}
                                onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                                placeholder="Feature 1, Feature 2, Feature 3"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Describe what's included..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>Package Media (Images & Video)</Label>
                            <div className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-muted/50 transition-colors relative">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*,video/*"
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                    onChange={async (e) => {
                                        const files = e.target.files;
                                        if (!files) return;
                                        const validFiles: File[] = [];
                                        for (const file of Array.from(files)) {
                                            if (file.size > 50 * 1024 * 1024) {
                                                toast({ title: "File too large", description: "Max 50MB", variant: "destructive" });
                                                continue;
                                            }
                                            if (file.type.startsWith('video/')) {
                                                const isValid = await new Promise((resolve) => {
                                                    const video = document.createElement('video');
                                                    video.preload = 'metadata';
                                                    video.onloadedmetadata = () => {
                                                        window.URL.revokeObjectURL(video.src);
                                                        if (video.duration < 15 || video.duration > 30) {
                                                            toast({ title: "Invalid Video", description: "Must be 15-30s", variant: "destructive" });
                                                            resolve(false);
                                                        } else resolve(true);
                                                    };
                                                    video.onerror = () => resolve(false);
                                                    video.src = URL.createObjectURL(file);
                                                });
                                                if (!isValid) continue;
                                            }
                                            validFiles.push(file);
                                        }
                                        const newUrls = validFiles.map(f => URL.createObjectURL(f));
                                        setFormData(prev => ({ ...prev, images: [...(prev.images || []), ...newUrls] }));
                                        toast({ title: "Added", description: `${validFiles.length} files added.` });
                                    }}
                                />
                                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                    <Upload className="h-8 w-8" />
                                    <span>Click to upload images or video (15-30s)</span>
                                </div>
                            </div>
                            {/* Preview List */}
                            {formData.images && formData.images.length > 0 && (
                                <div className="flex gap-2 overflow-x-auto py-2">
                                    {formData.images.map((url: string, i: number) => (
                                        <div key={i} className="h-16 w-16 flex-shrink-0 rounded overflow-hidden border relative group">
                                            {url.startsWith('blob:') || url.match(/\.(mp4|webm)$/i) ? (
                                                <video src={url} className="h-full w-full object-cover" />
                                            ) : (
                                                <img src={url} className="h-full w-full object-cover" />
                                            )}
                                            <button
                                                className="absolute top-0 right-0 p-0.5 bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                                onClick={() => setFormData(prev => ({ ...prev, images: prev.images?.filter((_, idx) => idx !== i) }))}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSubmit}>Save Package</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
