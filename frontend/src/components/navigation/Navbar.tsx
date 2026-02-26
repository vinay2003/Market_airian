import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const { user, logout } = useAuth();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 shadow-sm">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
                <Menu className="h-5 w-5" />
            </Button>

            <div className="w-full flex-1">
                <form className="hidden md:flex items-center gap-2 max-w-md">
                    <div className="relative w-full">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search..."
                            className="w-full bg-background pl-8 md:w-[300px] lg:w-[300px]"
                        />
                    </div>
                </form>
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary" />
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.logoUrl || user?.logo || user?.avatar} alt={user?.businessName || user?.firstName || "User"} />
                                <AvatarFallback className="bg-primary/10 text-primary">
                                    {(user?.firstName || user?.role || "U").charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">
                                    {user?.firstName ? `${user.firstName} ${user.lastName || ''}` : "User"}
                                </p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.phone}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link to={user?.role === 'vendor' ? '/vendor/profile' : '/user/profile'}>
                                Profile
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link to={user?.role === 'vendor' ? '/vendor/settings' : '/user/settings'}>
                                Settings
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
