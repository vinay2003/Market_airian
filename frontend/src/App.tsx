import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/500.css';
import '@fontsource/playfair-display/400.css';
import '@fontsource/playfair-display/600.css';
import '@fontsource/playfair-display/700.css';
import { AuthProvider } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

// Eagerly load critical pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';

// Lazy Load Vendor Pages
const VendorOnboarding = lazy(() => import('@/pages/vendor/Onboarding'));
const VendorDashboard = lazy(() => import('@/pages/vendor/Dashboard'));
const VendorPublicProfile = lazy(() => import('@/pages/public/VendorProfile'));
const BrowseVendors = lazy(() => import('@/pages/public/BrowseVendors'));
const VendorProfileEditor = lazy(() => import('@/pages/vendor/ProfileEditor'));
const PackageManager = lazy(() => import('@/pages/vendor/PackageManager'));
const GalleryManager = lazy(() => import('@/pages/vendor/GalleryManager'));
const BookingsManager = lazy(() => import('@/pages/vendor/BookingsManager'));
const VendorSettings = lazy(() => import('@/pages/vendor/Settings'));

// Lazy Load User Pages
const UserOnboarding = lazy(() => import('@/pages/user/Onboarding'));
const UserDashboard = lazy(() => import('@/pages/user/Dashboard'));
const UserBookings = lazy(() => import('@/pages/user/Bookings'));
const UserSettings = lazy(() => import('@/pages/user/Settings'));

// Layout & Components
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';

const PageLoader = () => (
  <div className="h-screen w-full flex items-center justify-center bg-background">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/vendors" element={<BrowseVendors />} />
              <Route path="/vendor/:id" element={<VendorPublicProfile />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/onboarding/user" element={<UserOnboarding />} />
            <Route path="/onboarding/vendor" element={<VendorOnboarding />} />

            {/* Protected Vendor Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/bookings" element={<BookingsManager />} />
                <Route path="/vendor/packages" element={<PackageManager />} />
                <Route path="/vendor/gallery" element={<GalleryManager />} />
                <Route path="/vendor/profile" element={<VendorProfileEditor />} />
                <Route path="/vendor/settings" element={<VendorSettings />} />
              </Route>
            </Route>

            {/* Protected User Dashboard */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route element={<DashboardLayout />}>
                <Route path="/user/dashboard" element={<UserDashboard />} />
                <Route path="/user/bookings" element={<UserBookings />} />
                <Route path="/user/favorites" element={<div>Favorites (Coming Soon)</div>} />
                <Route path="/user/profile" element={<UserSettings />} />
                <Route path="/user/settings" element={<UserSettings />} />
              </Route>
            </Route>

            {/* Catch all redirects */}
            <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="/user" element={<Navigate to="/user/dashboard" replace />} />

            {/* Legacy Onboarding Redirects */}
            <Route path="/vendor/onboarding" element={<Navigate to="/onboarding/vendor" replace />} />
            <Route path="/user/onboarding" element={<Navigate to="/onboarding/user" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
