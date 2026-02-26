import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, Save, Store, MapPin, Phone, Globe } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function VendorProfileEditor() {
    const { user, updateUser } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        businessName: '',
        description: '',
        phone: '',
        address: '',
        website: '',
        category: '',
    });
    const [logoUrl, setLogoUrl] = useState<string>('');
    const [avatarFile, setAvatarFile] = useState<File | null>(null);

    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await api.get('/vendors/profile');
                if (data) {
                    setFormData({
                        businessName: data.businessName || '',
                        description: data.description || '',
                        phone: data.user?.phone || user?.phone || '',
                        address: data.city || data.address || '',
                        website: data.socialLinks?.website || '',
                        category: data.serviceCategories?.[0] || '',
                    });
                    if (data.logoUrl) {
                        setLogoUrl(data.logoUrl);
                    }
                    if (data.logoUrl || data.businessName) {
                        updateUser({
                            logoUrl: data.logoUrl,
                            businessName: data.businessName
                        });
                    }
                }
            } catch (error) {
                console.error("Error fetching profile", error);
            } finally {
                setLoadingData(false);
            }
        };
        fetchProfile();
    }, [user, updateUser]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setAvatarFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // If they selected a new logo, upload it first
            let finalLogoUrl = logoUrl;
            if (avatarFile) {
                const formDataFile = new FormData();
                formDataFile.append('file', avatarFile);
                const { data: uploadData } = await api.post('/vendors/upload-logo', formDataFile, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (uploadData?.logoUrl) {
                    finalLogoUrl = uploadData.logoUrl;
                    setLogoUrl(finalLogoUrl);
                }
            }

            // Update text details
            await api.post('/vendors/profile', {
                businessName: formData.businessName,
                description: formData.description,
                city: formData.address, // mapping address field to city for now
                address: formData.address,
                serviceCategories: [formData.category],
                socialLinks: { website: formData.website }
            });

            updateUser({
                businessName: formData.businessName,
                logoUrl: finalLogoUrl
            });

            toast({
                title: "Profile Updated",
                description: "Your business details have been saved successfully.",
            });
            // Re-fetch or reset file state
            setAvatarFile(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update profile. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    if (loadingData) {
        return <div className="flex justify-center p-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Business Profile</h1>
                    <p className="text-muted-foreground">
                        Manage how you appear to customers on the marketplace.
                    </p>
                </div>
                <Button onClick={handleSubmit} disabled={loading}>
                    <Save className="mr-2 h-4 w-4" />
                    {loading ? 'Saving...' : 'Save Changes'}
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Visual Branding Section */}
                <Card className="md:col-span-1">
                    <CardHeader>
                        <CardTitle>Branding</CardTitle>
                        <CardDescription>Logo and visual identity</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 flex flex-col items-center text-center">
                        <div className="relative group">
                            <Avatar className="h-32 w-32 border-4 border-muted flex items-center justify-center overflow-hidden">
                                {avatarFile || logoUrl ? (
                                    <AvatarImage className="object-cover w-full h-full" src={avatarFile ? URL.createObjectURL(avatarFile) : logoUrl} />
                                ) : (
                                    <AvatarFallback className="text-4xl">
                                        {formData.businessName.charAt(0) || "B"}
                                    </AvatarFallback>
                                )}
                            </Avatar>
                            <label className="absolute inset-0 flex items-center justify-center bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                                <Upload className="h-6 w-6" />
                                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-medium">Business Logo</h3>
                            <p className="text-xs text-muted-foreground">
                                Recommended: 400x400px, JPG or PNG.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Main Details Section */}
                <Card className="md:col-span-2">
                    <CardHeader>
                        <CardTitle>Business Details</CardTitle>
                        <CardDescription>Public information about your services</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-2">
                            <Label htmlFor="businessName">Business Name</Label>
                            <div className="relative">
                                <Store className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="businessName"
                                    name="businessName"
                                    value={formData.businessName}
                                    onChange={handleChange}
                                    className="pl-9"
                                    placeholder="e.g. Dreamy Weddings & Events"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">About Your Business</Label>
                            <Textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Tell customers about your experience and style..."
                                className="min-h-[120px]"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="category">Service Category</Label>
                                <Input
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    placeholder="e.g. Photography"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website (Optional)</Label>
                                <div className="relative">
                                    <Globe className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="website"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleChange}
                                        className="pl-9"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Contact Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="address">Location</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="pl-9"
                                        placeholder="City, State"
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
