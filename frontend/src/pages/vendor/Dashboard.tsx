import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutDashboard, Users, Eye, Settings, LogOut, Plus, Trash2, Image as ImageIcon, Briefcase } from 'lucide-react';

export default function VendorDashboard() {
    const { logout } = useAuth();
    const [profile, setProfile] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Form States
    const [newPackage, setNewPackage] = useState({ name: '', description: '', price: '', features: '' });
    const [packageFiles, setPackageFiles] = useState<FileList | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/vendors/profile');
            setProfile(res.data);
        } catch (err: any) {
            console.error("Failed to load profile", err);
            if (err.response?.status === 401) {
                logout();
                window.location.href = '/login'; // Force reload/redirect to clear state
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleEditClick = (pkg: any) => {
        setNewPackage({
            name: pkg.name,
            description: pkg.description,
            price: pkg.price.toString(),
            features: Array.isArray(pkg.features) ? pkg.features.join(', ') : pkg.features
        });
        setEditingId(pkg.id);
        document.querySelector('#package-form')?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setNewPackage({ name: '', description: '', price: '', features: '' });
        setEditingId(null);
        setPackageFiles(null);
    };

    const handleAddPackage = async () => {
        try {
            const formData = new FormData();
            formData.append('name', newPackage.name);
            formData.append('description', newPackage.description);
            formData.append('price', newPackage.price);
            formData.append('features', newPackage.features);

            if (packageFiles) {
                for (let i = 0; i < packageFiles.length; i++) {
                    formData.append('images', packageFiles[i]);
                }
            }

            setUploading(true);

            if (editingId) {
                await api.patch(`/vendors/packages/${editingId}`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else {
                await api.post('/vendors/packages', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setNewPackage({ name: '', description: '', price: '', features: '' });
            setPackageFiles(null);
            setEditingId(null);
            fetchProfile(); // Refresh
        } catch (error) {
            console.error(error);
            alert('Failed to save package');
        } finally {
            setUploading(false);
        }
    };

    const handleDeletePackage = async (id: string) => {
        if (!confirm('Are you sure?')) return;
        try {
            await api.delete(`/vendors/packages/${id}`);
            fetchProfile();
        } catch (error) {
            alert('Failed to delete package');
        }
    };

    const handleUploadGallery = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('/vendors/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            fetchProfile();
        } catch (error) {
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteGallery = async (id: string) => {
        if (!confirm('Delete this image?')) return;
        try {
            await api.delete(`/vendors/gallery/${id}`);
            fetchProfile();
        } catch (error) {
            alert('Failed to delete image');
        }
    };

    if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:block fixed h-full">
                <div className="p-6">
                    <h2 className="text-xl font-bold tracking-tight text-primary">MarketFly</h2>
                    <p className="text-xs text-gray-500 uppercase mt-1 tracking-wider">Vendor Portal</p>
                </div>
                <nav className="p-4 space-y-2">
                    <Button variant="ghost" className="w-full justify-start font-medium text-gray-600"><LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-gray-600"><Briefcase className="mr-2 h-4 w-4" /> Packages</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-gray-600"><ImageIcon className="mr-2 h-4 w-4" /> Gallery</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-gray-600"><Users className="mr-2 h-4 w-4" /> Leads</Button>
                    <Button variant="ghost" className="w-full justify-start font-medium text-gray-600"><Settings className="mr-2 h-4 w-4" /> Settings</Button>
                </nav>
                <div className="absolute bottom-8 left-4 right-4">
                    <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 md:ml-64">
                <div className="max-w-6xl mx-auto space-y-8">
                    {/* Header */}
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                            <p className="text-gray-500 mt-1">Manage your business and bookings</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <Badge variant="outline" className="text-sm px-3 py-1 capitalize">{profile?.businessType}</Badge>
                            <Button size="sm" variant="outline" onClick={() => window.open(`/vendor/${profile?.id}`, '_blank')}>
                                View Public Profile <Eye className="ml-2 h-4 w-4" />
                            </Button>
                        </div>
                    </div>

                    <Tabs defaultValue="overview" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="overview">Overview</TabsTrigger>
                            <TabsTrigger value="packages">Packages & Plans</TabsTrigger>
                            <TabsTrigger value="gallery">Gallery</TabsTrigger>
                            <TabsTrigger value="leads">Leads</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            {/* Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Total Profile Views</CardTitle>
                                        <Eye className="h-4 w-4 text-gray-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">12</div>
                                        <p className="text-xs text-gray-500">+2 from yesterday</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Active Packages</CardTitle>
                                        <Briefcase className="h-4 w-4 text-gray-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{profile?.packages?.length || 0}</div>
                                        <p className="text-xs text-gray-500">Live on your profile</p>
                                    </CardContent>
                                </Card>
                                <Card>
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                        <CardTitle className="text-sm font-medium">Gallery Items</CardTitle>
                                        <ImageIcon className="h-4 w-4 text-gray-500" />
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">{profile?.gallery?.length || 0}</div>
                                        <p className="text-xs text-gray-500">Photos & Videos</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </TabsContent>

                        <TabsContent value="packages" className="space-y-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Create Package Form */}
                                <Card className="md:col-span-1 border-dashed bg-gray-50/50" id="package-form">
                                    <CardHeader>
                                        <CardTitle className="text-base">{editingId ? 'Edit Package' : 'Create New Package'}</CardTitle>
                                        <CardDescription>{editingId ? 'Update package details.' : 'Add a new booking plan for customers.'}</CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Package Name</Label>
                                            <Input placeholder="e.g. Gold Wedding Package" value={newPackage.name} onChange={e => setNewPackage({ ...newPackage, name: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Price (₹)</Label>
                                            <Input type="number" placeholder="50000" value={newPackage.price} onChange={e => setNewPackage({ ...newPackage, price: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Features (comma separated)</Label>
                                            <Textarea placeholder="Photography, Drone, Album..." value={newPackage.features} onChange={e => setNewPackage({ ...newPackage, features: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Description</Label>
                                            <Textarea placeholder="Detailed description..." value={newPackage.description} onChange={e => setNewPackage({ ...newPackage, description: e.target.value })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Package Images</Label>
                                            <Input type="file" multiple accept="image/*" onChange={(e) => setPackageFiles(e.target.files)} />
                                        </div>
                                        <div className="flex gap-2">
                                            <Button onClick={handleAddPackage} className="flex-1" disabled={!newPackage.name || !newPackage.price || uploading}>
                                                <Plus className="mr-2 h-4 w-4" /> {uploading ? 'Saving...' : (editingId ? 'Update Package' : 'Add Package')}
                                            </Button>
                                            {editingId && (
                                                <Button variant="outline" onClick={handleCancelEdit}>Cancel</Button>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Package List */}
                                <div className="md:col-span-2 space-y-4">
                                    <h3 className="font-semibold text-lg">Your Active Packages</h3>
                                    {profile?.packages?.length === 0 && <p className="text-gray-500 italic">No packages added yet.</p>}
                                    <div className="grid gap-4">
                                        {profile?.packages?.map((pkg: any) => (
                                            <Card key={pkg.id} className="relative group hover:shadow-md transition-shadow">
                                                <CardHeader className="pb-2">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <CardTitle className="text-lg">{pkg.name}</CardTitle>
                                                            <div className="text-2xl font-bold text-primary mt-1">₹{pkg.price}</div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <Button variant="ghost" size="icon" className="text-blue-500 hover:text-blue-700 hover:bg-blue-50" onClick={() => handleEditClick(pkg)}>
                                                                <Settings className="h-4 w-4" />
                                                            </Button>
                                                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePackage(pkg.id)}>
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardHeader>
                                                <CardContent>
                                                    <p className="text-sm text-gray-600 mb-2">{pkg.description}</p>
                                                    <div className="flex flex-wrap gap-2 mb-3">
                                                        {pkg.features?.map((f: string, i: number) => (
                                                            <Badge key={i} variant="secondary" className="text-xs bg-gray-100">{f}</Badge>
                                                        ))}
                                                    </div>
                                                    {pkg.images && pkg.images.length > 0 && (
                                                        <div className="flex gap-2 overflow-x-auto pb-2">
                                                            {pkg.images.map((img: string, i: number) => (
                                                                <img key={i} src={img} alt="" className="h-16 w-16 object-cover rounded-md border" />
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="gallery" className="space-y-6">
                            <Card className="border-dashed bg-gray-50/50">
                                <CardContent className="flex flex-col items-center justify-center p-8 text-center">
                                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                                        <ImageIcon className="h-8 w-8 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-lg">Upload Photos & Videos</h3>
                                    <p className="text-gray-500 mb-4 max-w-sm">Showcase your work to attract more clients. High quality images work best.</p>
                                    <div className="relative">
                                        <Button disabled={uploading}>
                                            {uploading ? "Uploading..." : "Select Files"}
                                        </Button>
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleUploadGallery} accept="image/*,video/*" disabled={uploading} />
                                    </div>
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {profile?.gallery?.map((item: any) => (
                                    <div key={item.id} className="group relative rounded-lg overflow-hidden border bg-gray-100 aspect-square">
                                        {item.type === 'video' ? (
                                            <video src={item.url} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <Button variant="destructive" size="sm" onClick={() => handleDeleteGallery(item.id)}>
                                                <Trash2 className="h-4 w-4" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </TabsContent>

                        <TabsContent value="leads">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Event Requests</CardTitle>
                                    <CardDescription>All your booking inquiries.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-40 flex items-center justify-center text-gray-400 text-sm border-dashed border-2 rounded-lg">
                                        You have no new event requests.
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </div>
    );
}
