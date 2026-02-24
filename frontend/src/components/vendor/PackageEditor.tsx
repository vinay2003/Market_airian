import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { X, Plus, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface PackageEditorProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    pkg?: any; // If provided, we are editing
}

export default function PackageEditor({ isOpen, onClose, onSuccess, pkg }: PackageEditorProps) {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [files, setFiles] = useState<FileList | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        tier: 'basic',
        features: [] as string[],
        currentFeature: ''
    });

    useEffect(() => {
        if (pkg) {
            setFormData({
                name: pkg.name,
                description: pkg.description,
                price: pkg.price?.toString(),
                tier: pkg.tier || 'basic',
                features: Array.isArray(pkg.features) ? pkg.features : [],
                currentFeature: ''
            });
        } else {
            // Reset for new package
            setFormData({
                name: '',
                description: '',
                price: '',
                tier: 'basic',
                features: [],
                currentFeature: ''
            });
            setFiles(null);
        }
    }, [pkg, isOpen]);

    const handleAddFeature = () => {
        if (!formData.currentFeature.trim()) return;
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, prev.currentFeature.trim()],
            currentFeature: ''
        }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            data.append('price', formData.price);
            data.append('tier', formData.tier);

            // Backend expects simple array or comma separated? 
            // Based on previous code it seemed backend handles array or split.
            // Let's send as loop for array if backend uses NestJS FileInterceptor logic properly for arrays, 
            // OR join them if it expects string. Assuming entity uses `simple-array`, TypeORM handles comma separation string internally, 
            // but controller typically expects array or string. 
            // Let's normalize to multiple append for array if supporting that, or join.
            // Safe bet: JSON stringify or join for now if backend logic is simple.
            // Re-checking vendor controller... previous code used `formData.append('features', newPackage.features)` which was text.
            // So we join them.
            data.append('features', formData.features.join(','));

            if (files) {
                for (let i = 0; i < files.length; i++) {
                    data.append('images', files[i]);
                }
            }

            if (pkg?.id) {
                await api.patch(`vendors/packages/${pkg.id}`, data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast({ title: "Updated", description: "Package updated successfully." });
            } else {
                await api.post('vendors/packages', data, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                toast({ title: "Created", description: "Package created successfully." });
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save package.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{pkg ? 'Edit Package' : 'Create New Package'}</DialogTitle>
                    <DialogDescription>
                        Configure your {formData.tier} offering details.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Package Name</Label>
                            <Input
                                placeholder="e.g. Gold Wedding"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Tier</Label>
                            <Select
                                value={formData.tier}
                                onValueChange={v => setFormData({ ...formData, tier: v })}
                            >
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="basic">Basic (Entry)</SelectItem>
                                    <SelectItem value="standard">Standard (Most Popular)</SelectItem>
                                    <SelectItem value="premium">Premium (High End)</SelectItem>
                                    <SelectItem value="custom">Custom</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Price (₹)</Label>
                        <Input
                            type="number"
                            placeholder="50000"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Describe what's included..."
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Features</Label>
                        <div className="flex gap-2">
                            <Input
                                placeholder="Add feature (e.g. 4K Video)"
                                value={formData.currentFeature}
                                onChange={e => setFormData({ ...formData, currentFeature: e.target.value })}
                                onKeyDown={e => e.key === 'Enter' && handleAddFeature()}
                            />
                            <Button type="button" variant="secondary" onClick={handleAddFeature}><Plus className="h-4 w-4" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {formData.features.map((f, i) => (
                                <Badge key={i} variant="outline" className="pl-2 pr-1 py-1 flex gap-1 items-center">
                                    {f}
                                    <X className="h-3 w-3 cursor-pointer hover:text-red-500" onClick={() => removeFeature(i)} />
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Images</Label>
                        <Input type="file" multiple accept="image/*" onChange={e => setFiles(e.target.files)} />
                        <p className="text-xs text-gray-500">Upload high quality images for this specific package.</p>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading || !formData.name || !formData.price}>
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Package
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
