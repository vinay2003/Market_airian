import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Loader2, Image as ImageIcon, Video } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function GalleryManager() {
    const { toast } = useToast();
    const [gallery, setGallery] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchGallery();
    }, []);

    const fetchGallery = async () => {
        try {
            const res = await api.get('vendors/profile');
            setGallery(res.data.gallery || []);
        } catch (error) {
            console.error("Failed to load gallery", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: any) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Basic validation
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
            toast({ title: "File too large", description: "Please upload files smaller than 10MB.", variant: "destructive" });
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        setUploading(true);
        try {
            await api.post('vendors/gallery', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            toast({ title: "Uploaded", description: "Media added to gallery." });
            fetchGallery();
        } catch (error) {
            console.error(error);
            toast({ title: "Upload failed", description: "Could not upload file.", variant: "destructive" });
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this item?')) return;
        try {
            await api.delete(`vendors/gallery/${id}`);
            setGallery(gallery.filter(item => item.id !== id));
            toast({ title: "Deleted", description: "Item removed from gallery." });
        } catch {
            toast({ title: "Error", description: "Failed to delete item.", variant: "destructive" });
        }
    };

    if (loading) return <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Gallery</h2>
                    <p className="text-gray-500">Manage photos and videos showcasing your work.</p>
                </div>
            </div>

            <Card className="border-dashed bg-gray-50/50 transition-colors hover:bg-gray-50">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <div className="bg-primary/10 p-4 rounded-full mb-4">
                        <ImageIcon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg">Upload Media</h3>
                    <p className="text-gray-500 mb-6 max-w-sm">
                        Support for JPG, PNG and MP4. Max file size 10MB.
                    </p>
                    <div className="relative">
                        <Button disabled={uploading} size="lg">
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {uploading ? "Uploading..." : "Select Files"}
                        </Button>
                        <input
                            type="file"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleUpload}
                            accept="image/*,video/*"
                            disabled={uploading}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {gallery.length === 0 && (
                    <div className="col-span-full text-center py-12 text-gray-400">
                        No items in gallery yet.
                    </div>
                )}

                {gallery.map((item) => (
                    <div key={item.id} className="group relative rounded-xl overflow-hidden border bg-gray-100 aspect-square shadow-sm hover:shadow-md transition-all">
                        {item.type === 'video' || item.url.endsWith('.mp4') ? (
                            <div className="relative w-full h-full">
                                <video src={item.url} className="w-full h-full object-cover" />
                                <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                                    <Video className="h-4 w-4" />
                                </div>
                            </div>
                        ) : (
                            <img src={item.url} alt="Gallery item" className="w-full h-full object-cover" />
                        )}

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDelete(item.id)}
                            >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
