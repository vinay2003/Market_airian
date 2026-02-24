import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { api } from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

export default function Settings() {
    const { user, logout, updateUser } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    // Form States
    const [accountForm, setAccountForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    });

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [notificationForm, setNotificationForm] = useState({
        email: true,
        sms: true,
        bookingUpdates: true,
        marketing: false
    });

    useEffect(() => {
        if (user) {
            setAccountForm({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            if (user.notificationPreferences) {
                setNotificationForm(user.notificationPreferences);
            }
        }
    }, [user]);

    const handleAccountUpdate = async () => {
        setLoading(true);
        try {
            const { data } = await api.patch('users/me', {
                firstName: accountForm.firstName,
                lastName: accountForm.lastName,
                // Email/Phone updates might need verification, restricted for now or allow if backend permits
            });
            updateUser(data);
            toast({ title: "Profile Updated", description: "Your account details have been saved." });
        } catch {
            toast({ title: "Error", description: "Failed to update profile.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast({ title: "Mismatch", description: "New passwords do not match.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            await api.patch('users/me', { password: passwordForm.newPassword });
            toast({ title: "Password Updated", description: "Your password has been changed." });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch {
            toast({ title: "Error", description: "Failed to update password.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleNotificationUpdate = async () => {
        setLoading(true);
        try {
            const { data } = await api.patch('users/me', { notificationPreferences: notificationForm });
            updateUser(data);
            toast({ title: "Preferences Saved", description: "Notification settings updated." });
        } catch {
            toast({ title: "Error", description: "Failed to update preferences.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account and notification preferences.</p>
            </div>

            <Tabs defaultValue="account" className="space-y-4">
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="security">Security</TabsTrigger>
                    <TabsTrigger value="notifications">Notifications</TabsTrigger>
                </TabsList>

                {/* Account Details */}
                <TabsContent value="account">
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                            <CardDescription>Your personal account details.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                                    {user?.firstName?.[0] || 'U'}
                                </div>
                                <div>
                                    <h3 className="font-medium text-lg">{user?.firstName} {user?.lastName}</h3>
                                    <p className="text-sm text-muted-foreground">{user?.email || user?.phone}</p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>First Name</Label>
                                    <Input value={accountForm.firstName} onChange={e => setAccountForm({ ...accountForm, firstName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Last Name</Label>
                                    <Input value={accountForm.lastName} onChange={e => setAccountForm({ ...accountForm, lastName: e.target.value })} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={accountForm.email} disabled className="bg-muted" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input value={accountForm.phone} disabled className="bg-muted" />
                                </div>
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handleAccountUpdate} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Security */}
                <TabsContent value="security">
                    <Card>
                        <CardHeader>
                            <CardTitle>Login & Security</CardTitle>
                            <CardDescription>Manage your password.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>New Password</Label>
                                <Input type="password" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirm New Password</Label>
                                <Input type="password" value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} />
                            </div>
                            <div className="flex justify-end mt-4">
                                <Button onClick={handlePasswordUpdate} disabled={loading}>{loading ? 'Updating...' : 'Update Password'}</Button>
                            </div>

                            <div className="border-t pt-6 mt-6">
                                <h3 className="text-lg font-medium text-destructive mb-2">Danger Zone</h3>
                                <div className="flex justify-between items-center p-4 border border-destructive/20 rounded-md bg-destructive/5">
                                    <div>
                                        <p className="font-medium text-destructive">Sign out</p>
                                        <p className="text-sm text-muted-foreground">Log out of your account.</p>
                                    </div>
                                    <Button variant="destructive" onClick={logout}>
                                        <LogOut className="mr-2 h-4 w-4" /> Logout
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Notifications */}
                <TabsContent value="notifications">
                    <Card>
                        <CardHeader>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Choose how you want to be notified.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Receive emails for important updates.</p>
                                    </div>
                                    <input type="checkbox" className="toggle" checked={notificationForm.email} onChange={e => setNotificationForm({ ...notificationForm, email: e.target.checked })} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>SMS Alerts</Label>
                                        <p className="text-sm text-muted-foreground">Receive SMS for bookings.</p>
                                    </div>
                                    <input type="checkbox" className="toggle" checked={notificationForm.sms} onChange={e => setNotificationForm({ ...notificationForm, sms: e.target.checked })} />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <Button onClick={handleNotificationUpdate} disabled={loading}>{loading ? 'Saving...' : 'Save Preferences'}</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
