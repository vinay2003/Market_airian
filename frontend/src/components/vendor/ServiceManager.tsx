import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, X, Layers, Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ServiceManager() {
    const { toast } = useToast();
    const [categories, setCategories] = useState<string[]>([]);
    const [newCategory, setNewCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Initial load
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/vendors/profile');
            // Mapping to serviceCategories
            setCategories(res.data.serviceCategories || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = () => {
        if (!newCategory.trim()) return;
        if (categories.includes(newCategory.trim())) {
            toast({ title: "Duplicate", description: "Category already exists.", variant: "destructive" });
            return;
        }
        setCategories([...categories, newCategory.trim()]);
        setNewCategory('');
    };

    const handleRemoveCategory = (cat: string) => {
        setCategories(categories.filter(c => c !== cat));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            // Updating profile with new categories
            await api.patch('/vendors/profile', { serviceCategories: categories });
            toast({ title: "Saved", description: "Service categories updated." });
        } catch (error) {
            toast({ title: "Error", description: "Failed to save categories.", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">Service Categories</h2>
                <p className="text-gray-500">Define the types of services you officer to helps clients find you.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-primary" /> Active Categories
                    </CardTitle>
                    <CardDescription>
                        Tags that describe your business (e.g., "Wedding Photography", "Candid Shoots", "Drone Coverage").
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Add a new category..."
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                            className="max-w-sm"
                        />
                        <Button onClick={handleAddCategory} disabled={!newCategory.trim()}>
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg min-h-[100px] border-dashed border-2">
                        {categories.length === 0 && (
                            <div className="w-full flex flex-col items-center justify-center text-gray-400">
                                <Lightbulb className="h-8 w-8 mb-2 opacity-50" />
                                <p>No categories added yet. Add tags to get discovered.</p>
                            </div>
                        )}
                        {categories.map((cat) => (
                            <Badge key={cat} variant="secondary" className="pl-3 pr-1 py-1 text-sm flex items-center gap-2 bg-white border border-gray-200 shadow-sm">
                                {cat}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-4 w-4 rounded-full hover:bg-red-50 hover:text-red-500"
                                    onClick={() => handleRemoveCategory(cat)}
                                >
                                    <X className="h-3 w-3" />
                                </Button>
                            </Badge>
                        ))}
                    </div>

                    <div className="flex justify-end pt-4 border-t">
                        <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto">
                            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
