import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trash2, MapPin, Globe, Instagram, Facebook, Save, Loader2, Store, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Location {
    address: string;
    city: string;
    state?: string; // Added state
    country?: string; // Added country
    pincode?: string;
    landmark?: string;
    mapUrl?: string;
}

interface SocialLinks {
    instagram?: string;
    website?: string;
    facebook?: string;
}

export default function VendorProfileEditor() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        businessName: '',
        businessType: 'individual',
        description: '',
        termsAndConditions: '',
        gstNumber: '',
        yearsInBusiness: '',
        locations: [] as Location[],
        socialLinks: { instagram: '', website: '', facebook: '' } as SocialLinks,
        logoUrl: '',
        bannerUrl: ''
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('vendors/profile');
            const data = res.data;
            setFormData({
                businessName: data.businessName || '',
                businessType: data.businessType || 'individual',
                description: data.description || '',
                termsAndConditions: data.termsAndConditions || '',
                gstNumber: data.gstNumber || '',
                yearsInBusiness: data.yearsInBusiness?.toString() || '',
                locations: data.locations || [],
                socialLinks: data.socialLinks || { instagram: '', website: '', facebook: '' },
                logoUrl: data.logoUrl || '',
                bannerUrl: data.bannerUrl || ''
            });
        } catch (error) {
            console.error("Failed to load profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        // Validation
        if (!formData.businessName.trim()) {
            toast({ title: "Validation Error", description: "Business Name is required", variant: "destructive" });
            return;
        }
        if (!formData.description.trim()) {
            toast({ title: "Validation Error", description: "Description is required", variant: "destructive" });
            return;
        }
        if (formData.locations.length > 0) {
            for (const loc of formData.locations) {
                if (!loc.address?.trim() || !loc.city?.trim() || !loc.state?.trim()) {
                    toast({ title: "Validation Error", description: "Address, City and State are required for all locations", variant: "destructive" });
                    return;
                }
            }
        }

        setSaving(true);
        try {
            await api.post('vendors/profile', {
                ...formData,
                yearsInBusiness: parseInt(formData.yearsInBusiness) || 0
            });
            toast({ title: "Success", description: "Profile updated successfully." });
        } catch (error) {
            console.error("Failed to save", error);
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    // Location Handlers
    const addLocation = () => {
        setFormData(prev => ({
            ...prev,
            locations: [...prev.locations, { address: '', city: '' }]
        }));
    };

    const updateLocation = (index: number, field: keyof Location, value: string) => {
        const newLocations = [...formData.locations];
        newLocations[index] = { ...newLocations[index], [field]: value };
        setFormData(prev => ({ ...prev, locations: newLocations }));
    };

    const removeLocation = (index: number) => {
        setFormData(prev => ({
            ...prev,
            locations: prev.locations.filter((_, i) => i !== index)
        }));
    };

    const handleImageUpload = async (e: any, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        try {
            setLoading(true); // Show global loading or local loading state
            const endpoint = type === 'logo' ? 'vendors/upload-logo' : 'vendors/upload-banner';
            const res = await api.post(endpoint, uploadData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const newUrl = type === 'logo' ? res.data.logoUrl : res.data.bannerUrl;

            setFormData(prev => ({
                ...prev,
                [type === 'logo' ? 'logoUrl' : 'bannerUrl']: newUrl
            }));

            toast({ title: "Success", description: `${type === 'logo' ? 'Logo' : 'Banner'} uploaded successfully.` });
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to upload image.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
                    <p className="text-gray-500">Manage your business details and public presence.</p>
                </div>
                <Button onClick={handleSave} disabled={saving}>
                    {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
            </div>

            <Tabs defaultValue="business" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="business">Business Details</TabsTrigger>
                    <TabsTrigger value="locations">Locations & Contact</TabsTrigger>
                    <TabsTrigger value="legal">Terms & Legal</TabsTrigger>
                </TabsList>

                <TabsContent value="business" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Branding & Images</CardTitle>
                            <CardDescription>Upload your logo and a profile banner.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <Label>Business Logo</Label>
                                    <div className="flex items-center gap-4">
                                        <div className="h-24 w-24 rounded-full border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                            {formData.logoUrl ? (
                                                <img src={formData.logoUrl} alt="Logo" className="h-full w-full object-cover" />
                                            ) : (
                                                <Store className="h-8 w-8 text-gray-400" />
                                            )}
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm" className="relative">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => handleImageUpload(e, 'logo')}
                                                    accept="image/*"
                                                />
                                                Change Logo
                                            </Button>
                                            <p className="text-xs text-gray-500 mt-1">Recommended: 400x400px</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <Label>Profile Banner</Label>
                                    <div className="w-full h-32 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden relative">
                                        {formData.bannerUrl ? (
                                            <img src={formData.bannerUrl} alt="Banner" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="text-gray-400 flex flex-col items-center">
                                                <Image className="h-8 w-8 mb-1" />
                                                <span className="text-xs">No banner uploaded</span>
                                            </div>
                                        )}
                                        <div className="absolute bottom-2 right-2">
                                            <Button variant="secondary" size="sm" className="relative shadow-sm">
                                                <input
                                                    type="file"
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={(e) => handleImageUpload(e, 'banner')}
                                                    accept="image/*"
                                                />
                                                <Plus className="h-3 w-3 mr-1" /> Upload Banner
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500">Recommended: 1200x400px. Shows on your public profile header.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>This information is displayed on your public profile.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Business Name <span className="text-red-500">*</span></Label>
                                    <Input
                                        value={formData.businessName}
                                        onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                                        placeholder="e.g. Royal Weddings"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Business Type <span className="text-red-500">*</span></Label>
                                    <Select
                                        value={formData.businessType}
                                        onValueChange={v => setFormData({ ...formData, businessType: v })}
                                    >
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="individual">Freelancer</SelectItem>
                                            <SelectItem value="company">Company</SelectItem>
                                            <SelectItem value="agency">Agency</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>About your Business <span className="text-red-500">*</span></Label>
                                <Textarea
                                    className="h-32"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Tell clients what makes your service special..."
                                />
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label>Years in Business <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                    <Input
                                        type="number"
                                        value={formData.yearsInBusiness}
                                        onChange={e => setFormData({ ...formData, yearsInBusiness: e.target.value })}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Social Presence</CardTitle>
                            <CardDescription>Link your social media profiles to build trust.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Instagram className="h-4 w-4" /> Instagram URL <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                <Input
                                    placeholder="https://instagram.com/..."
                                    value={formData.socialLinks.instagram}
                                    onChange={e => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, instagram: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Globe className="h-4 w-4" /> Website URL <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                <Input
                                    placeholder="https://yourwebsite.com"
                                    value={formData.socialLinks.website}
                                    onChange={e => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, website: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2"><Facebook className="h-4 w-4" /> Facebook URL <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                <Input
                                    placeholder="https://facebook.com/..."
                                    value={formData.socialLinks.facebook}
                                    onChange={e => setFormData({
                                        ...formData,
                                        socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                                    })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="locations" className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Service Locations</CardTitle>
                                <CardDescription>Add all locations where you have a physical presence or office.</CardDescription>
                            </div>
                            <Button size="sm" variant="outline" onClick={addLocation}>
                                <Plus className="mr-2 h-4 w-4" /> Add Location
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {formData.locations.length === 0 && (
                                <div className="text-center py-8 text-gray-500 border-2 border-dashed rounded-lg">
                                    <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                    No locations added yet. Add your primary office address.
                                </div>
                            )}

                            {formData.locations.map((loc, index) => (
                                <div key={index} className="grid md:grid-cols-12 gap-4 items-start p-4 border rounded-lg bg-gray-50/50">
                                    <div className="md:col-span-1 flex justify-center pt-3">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                                            {index + 1}
                                        </div>
                                    </div>
                                    <div className="md:col-span-10 grid gap-4">
                                        <div className="space-y-2">
                                            <Label>Full Address <span className="text-red-500">*</span></Label>
                                            <Input
                                                value={loc.address}
                                                onChange={e => updateLocation(index, 'address', e.target.value)}
                                                placeholder="Shop No, Building, Street..."
                                            />
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Country <span className="text-red-500">*</span></Label>
                                                <Select value={loc.country} onValueChange={(v) => updateLocation(index, 'country', v)}>
                                                    <SelectTrigger><SelectValue placeholder="Select Country" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="India">India</SelectItem>
                                                        <SelectItem value="Other">Other</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>State/UT <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={loc.state}
                                                    onChange={e => updateLocation(index, 'state', e.target.value)}
                                                    placeholder="State"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>City <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={loc.city}
                                                    onChange={e => updateLocation(index, 'city', e.target.value)}
                                                    placeholder="Delhi"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Pincode <span className="text-red-500">*</span></Label>
                                                <Input
                                                    value={loc.pincode || ''}
                                                    onChange={e => updateLocation(index, 'pincode', e.target.value)}
                                                    placeholder="110001"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Landmark <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                                <Input
                                                    value={loc.landmark || ''}
                                                    onChange={e => updateLocation(index, 'landmark', e.target.value)}
                                                    placeholder="Near Metro Station"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Google Maps URL (Optional)</Label>
                                                <Input
                                                    value={loc.mapUrl}
                                                    onChange={e => updateLocation(index, 'mapUrl', e.target.value)}
                                                    placeholder="https://maps.google.com/..."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="md:col-span-1 flex justify-end pt-1">
                                        <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50" onClick={() => removeLocation(index)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="legal" className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Terms & Conditions</CardTitle>
                            <CardDescription>Define your booking terms, cancellation policies, and payment rules for clients.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Terms & Policy Text <span className="text-gray-400 text-xs">(Recommended)</span></Label>
                                <Textarea
                                    className="min-h-[300px] font-mono text-sm"
                                    value={formData.termsAndConditions}
                                    onChange={e => setFormData({ ...formData, termsAndConditions: e.target.value })}
                                    placeholder={`1. Booking Confirmation...\n2. Cancellation Policy...\n3. Payment Terms...`}
                                />
                                <p className="text-xs text-gray-500">This text will be shown to clients before they book your service.</p>
                            </div>

                            <div className="space-y-2">
                                <Label>GST Number <span className="text-gray-400 text-xs">(Optional)</span></Label>
                                <Input
                                    value={formData.gstNumber}
                                    onChange={e => setFormData({ ...formData, gstNumber: e.target.value })}
                                    placeholder="GSTIN..."
                                    className="max-w-xs"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
