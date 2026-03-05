import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface GalleryItem {
    id: string;
    url: string;
    type: 'image' | 'video';
}

export default function GalleryManager() {
    const { toast } = useToast();
    const [items, setItems] = useState<GalleryItem[]>([]);
    const [uploading, setUploading] = useState(false);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            setFetching(true);
            const { data } = await api.get('vendors/profile');
            if (data?.gallery) {
                setItems(data.gallery);
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to load gallery items.", variant: "destructive" });
        } finally {
            setFetching(false);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        let count = 0;

        try {
            for (const file of Array.from(files)) {
                // Size check (max 50MB)
                if (file.size > 50 * 1024 * 1024) {
                    toast({ title: "File too large", description: `${file.name} exceeds 50MB.`, variant: "destructive" });
                    continue;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', file.type.startsWith('video') ? 'video' : 'image');

                await api.post('vendors/gallery', formData);
                count++;
            }

            if (count > 0) {
                toast({ title: "Upload Complete", description: `Uploaded ${count} items.` });
                fetchGallery();
            }
        } catch (error) {
            toast({ title: "Upload Failed", description: "Some items could not be uploaded.", variant: "destructive" });
        } finally {
            setUploading(false);
            // Reset input
            e.target.value = '';
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Delete this item? This action cannot be undone.")) {
            try {
                await api.delete(`vendors/gallery/${id}`);
                setItems(prev => prev.filter(item => item.id !== id));
                toast({ title: "Item Deleted" });
            } catch (error) {
                toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
            }
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
                    <p className="text-muted-foreground">Manage your showcase images and videos for potential clients.</p>
                </div>
                <div className="relative">
                    <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <Button disabled={uploading}>
                        {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                        {uploading ? "Uploading..." : "Upload Photos & Videos"}
                    </Button>
                </div>
            </div>

            {fetching ? (
                <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {items.map((item) => (
                        <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted shadow-sm hover:shadow-md transition-shadow">
                            {item.type === 'video' ? (
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    onMouseOver={(e) => (e.target as HTMLVideoElement).play()}
                                    onMouseOut={(e) => (e.target as HTMLVideoElement).pause()}
                                />
                            ) : (
                                <img src={item.url} alt="Gallery" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            )}

                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>

                            {item.type === 'video' && (
                                <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-white/20">
                                    <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                                    VIDEO
                                </div>
                            )}
                        </div>
                    ))}

                    <div className="aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-muted-foreground hover:bg-muted/50 transition-colors relative">
                        <input
                            type="file"
                            multiple
                            accept="image/*,video/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleUpload}
                            disabled={uploading}
                        />
                        <ImageIcon className="h-8 w-8 mb-2" />
                        <span className="text-sm font-medium">Add More</span>
                    </div>
                </div>
            )}
        </div>
    );
}
