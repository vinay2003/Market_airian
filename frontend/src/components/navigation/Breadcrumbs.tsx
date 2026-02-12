import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumbs() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show on dashboard home as it's redundant with the title
    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="mb-4 hidden md:flex">
            <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li>
                    <Link to="/" className="flex items-center hover:text-foreground transition-colors">
                        <Home className="h-4 w-4" />
                    </Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathnames.length - 1;
                    const title = value.charAt(0).toUpperCase() + value.slice(1);

                    return (
                        <li key={to} className="flex items-center gap-2">
                            <ChevronRight className="h-4 w-4" />
                            {isLast ? (
                                <span className="font-medium text-foreground">{title}</span>
                            ) : (
                                <Link to={to} className="hover:text-foreground transition-colors">
                                    {title}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}
