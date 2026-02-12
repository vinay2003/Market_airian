import { useState } from 'react';
import { Button } from '@/components/ui/button';

import { Trash2, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface GalleryItem {
    id: string;
    url: string;
    type: 'image' | 'video';
}

const INITIAL_GALLERY: GalleryItem[] = [
    { id: '1', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'image' },
    { id: '2', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'image' },
    { id: '3', url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'image' },
    { id: '4', url: 'https://images.unsplash.com/photo-1519225421980-715cb0202128?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', type: 'image' },
];

export default function GalleryManager() {
    const { toast } = useToast();
    const [items, setItems] = useState<GalleryItem[]>(INITIAL_GALLERY);
    const [uploading, setUploading] = useState(false);

    const validateFile = async (file: File): Promise<boolean> => {
        // Size check (max 50MB)
        if (file.size > 50 * 1024 * 1024) {
            toast({ title: "File too large", description: "Max file size is 50MB.", variant: "destructive" });
            return false;
        }

        // Video duration check
        if (file.type.startsWith('video/')) {
            return new Promise((resolve) => {
                const video = document.createElement('video');
                video.preload = 'metadata';
                video.onloadedmetadata = () => {
                    window.URL.revokeObjectURL(video.src);
                    if (video.duration < 15 || video.duration > 30) {
                        toast({
                            title: "Invalid Video Duration",
                            description: `Video must be between 15 and 30 seconds. Current: ${video.duration.toFixed(1)}s`,
                            variant: "destructive"
                        });
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                };
                video.onerror = () => {
                    toast({ title: "Error", description: "Failed to load video metadata.", variant: "destructive" });
                    resolve(false);
                }
                video.src = URL.createObjectURL(file);
            });
        }
        return true;
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const validFiles: File[] = [];

        for (const file of Array.from(files)) {
            const isValid = await validateFile(file);
            if (isValid) validFiles.push(file);
        }

        if (validFiles.length > 0) {
            // Simulate upload delay (Replace with actual API call)
            setTimeout(() => {
                const newItems: GalleryItem[] = validFiles.map((file, i) => ({
                    id: Date.now().toString() + i,
                    url: URL.createObjectURL(file), // In real app, this would be the S3/Supabase URL
                    type: file.type.startsWith('video') ? 'video' : 'image'
                }));
                setItems(prev => [...prev, ...newItems]);
                setUploading(false);
                toast({ title: "Upload Complete", description: `Added ${validFiles.length} items.` });
            }, 1500);
        } else {
            setUploading(false);
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Delete this image?")) {
            setItems(items.filter(item => item.id !== id));
            toast({ title: "Item Deleted" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Gallery</h1>
                    <p className="text-muted-foreground">Showcase your best work to potential clients.</p>
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
                        {uploading ? "Uploading..." : "Upload Photos"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
                        {item.type === 'video' ? (
                            <video src={item.url} controls className="w-full h-full object-cover" />
                        ) : (
                            <img src={item.url} alt="Gallery" className="w-full h-full object-cover transition-transform hover:scale-105" />
                        )}

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {/* Upload Placeholder */}
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
        </div>
    );
}
