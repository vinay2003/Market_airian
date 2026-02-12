import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorFallbackProps {
    error?: Error;
    resetErrorBoundary?: () => void;
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-6 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-6">
                <AlertCircle className="h-10 w-10 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-2">
                Something went wrong
            </h1>
            <p className="text-muted-foreground max-w-md mb-8">
                {error?.message || "An unexpected error occurred. Please try again later."}
            </p>
            <div className="flex gap-4">
                <Button onClick={() => window.location.reload()} variant="outline">
                    Reload Page
                </Button>
                {resetErrorBoundary && (
                    <Button onClick={resetErrorBoundary}>Try Again</Button>
                )}
            </div>
        </div>
    );
}
