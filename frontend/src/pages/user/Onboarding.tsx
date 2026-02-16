import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from 'lucide-react';

const INTEREST_CATEGORIES = [
    "Weddings", "Corporate Events", "Birthday Parties", "Concerts", "Workshops", "Photography", "Catering"
];

export default function UserOnboarding() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        city: '',
        interests: [] as string[],
    });
    const { user, login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const toggleInterest = (interest: string) => {
        setFormData(prev => {
            const exists = prev.interests.includes(interest);
            if (exists) {
                return { ...prev, interests: prev.interests.filter(i => i !== interest) };
            }
            return { ...prev, interests: [...prev.interests, interest] };
        });
    };

    const handleSubmit = async () => {
        setLoading(true);
        try {
            // Depending on backend implementation, we might need a specific endpoint or just update user
            // Current VendorsController handles User updates for Vendors, but we need a similar one for Users.
            // Since we don't have a UsersController for updates yet, I'll rely on a new endpoint or existing if available.
            // For now, I'll assume we create a generic user update endpoint or reuse the Auth register logic if applicable.
            // Actually, standard practice: POST /users/profile or PUT /users/:id.
            // I need to implement this in backend. For now, I'll try POST /users/onboarding.

            const res = await api.post('/users/onboarding', formData);

            // Update local context if needed
            if (user && res.data) {
                login(localStorage.getItem('token') || '', { ...user, ...res.data });
            }

            navigate('/dashboard');
        } catch (error) {
            console.error('Onboarding failed', error);
            alert('Failed to save profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome! Let's get to know you</CardTitle>
                    <CardDescription>Step {step} of 2</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 1 && (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input id="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input id="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="john@example.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city">City</Label>
                                <Input id="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Mumbai" />
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <Label className="text-base">What are you interested in?</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                                {INTEREST_CATEGORIES.map(category => (
                                    <div key={category} className="flex items-center space-x-2 border p-3 rounded-md hover:bg-gray-50">
                                        <Checkbox
                                            id={category}
                                            checked={formData.interests.includes(category)}
                                            onCheckedChange={() => toggleInterest(category)}
                                        />
                                        <label
                                            htmlFor={category}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer w-full"
                                        >
                                            {category}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(s => s - 1)}>Back</Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 2 ? (
                        <Button onClick={() => setStep(s => s + 1)}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Get Started
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
