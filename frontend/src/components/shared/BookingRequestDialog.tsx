import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export function BookingRequestDialog({ vendorName, packs }: { vendorName: string, packs?: any[] }) {
    const { toast } = useToast();
    const [open, setOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    const handleSubmit = async () => {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setOpen(false);
        setStep(1);
        toast({
            title: "Request Sent!",
            description: `Your booking request has been sent to ${vendorName}. They will contact you shortly.`,
        });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="lg" className="w-full text-lg">Request Booking</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Book {vendorName}</DialogTitle>
                    <DialogDescription>
                        Fill in the details for your event. The vendor will confirm availability.
                    </DialogDescription>
                </DialogHeader>

                {step === 1 && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Event Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !date && "text-muted-foreground"
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="grid gap-2">
                            <Label>Event Type</Label>
                            <Input placeholder="e.g. Wedding, Birthday, Corporate" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Select Package (Optional)</Label>
                            <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="">No specific package</option>
                                {packs?.map((p: any) => (
                                    <option key={p.id} value={p.id}>{p.name} - ₹{p.price}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label>Your Name</Label>
                            <Input placeholder="John Doe" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Phone Number</Label>
                            <Input placeholder="+91 99999 99999" />
                        </div>
                        <div className="grid gap-2">
                            <Label>Message / Special Requests</Label>
                            <Textarea placeholder="Tell us more about your event requirements..." />
                        </div>
                    </div>
                )}

                <DialogFooter>
                    {step === 1 ? (
                        <Button onClick={() => setStep(2)} disabled={!date}>Next Step</Button>
                    ) : (
                        <div className="flex gap-2 w-full">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button>
                            <Button onClick={handleSubmit} disabled={loading} className="flex-1">
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {loading ? "Sending..." : "Send Request"}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
