import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

export default function Login() {
    const [step, setStep] = useState<'role' | 'phone'>('role');
    const [role, setRole] = useState<'user' | 'vendor' | 'admin'>('user');
    const [phone, setPhone] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post('/auth/login', { phone, role });
            const { accessToken, user } = response.data;
            login(accessToken, user);
            // For now, redirect vendors to onboarding. Logic can be improved to check if profile exists.
            if (user.role === 'vendor') {
                navigate('/vendor/onboarding');
            } else if (user.role === 'user') {
                navigate('/user/onboarding'); // Redirect users to onboarding
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Login failed', error);
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Login or Sign Up</CardTitle>
                    <CardDescription>
                        {step === 'role' && "Select your account type"}
                        {step === 'phone' && "Enter your phone number"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {step === 'role' && (
                        <div className="grid gap-4">
                            <Label htmlFor="role">I am a...</Label>
                            <Select onValueChange={(v: any) => setRole(v)} defaultValue={role}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="vendor">Vendor</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button onClick={() => setStep('phone')}>Next</Button>
                        </div>
                    )}

                    {step === 'phone' && (
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    placeholder="9876543210"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleLogin}>Login</Button>
                            <Button variant="ghost" onClick={() => setStep('role')}>Back</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
