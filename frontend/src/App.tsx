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
import { PageLoader } from '@/components/ui/page-loader';

// Eagerly load critical pages
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';

// Lazy Load Auth Pages
const VendorOnboarding = lazy(() => import('@/pages/vendor/Onboarding'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));

// Lazy Load Public Pages
const About = lazy(() => import('@/pages/public/About'));
const Legal = lazy(() => import('@/pages/public/Legal'));

// Lazy Load Vendor Pages
const VendorDashboard = lazy(() => import('@/pages/vendor/Dashboard'));
const VendorPublicProfile = lazy(() => import('@/pages/public/VendorProfile'));
const BrowseVendors = lazy(() => import('@/pages/public/BrowseVendors'));
const VendorProfileEditor = lazy(() => import('@/pages/vendor/ProfileEditor'));
const PackageManager = lazy(() => import('@/pages/vendor/PackageManager'));
const GalleryManager = lazy(() => import('@/pages/vendor/GalleryManager'));
const BookingsManager = lazy(() => import('@/pages/vendor/BookingsManager'));
const VendorSettings = lazy(() => import('@/pages/vendor/Settings'));

// Layout & Components
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ScrollToTop } from '@/components/layout/ScrollToTop';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/about" element={<About />} />
              <Route path="/legal" element={<Legal />} />
              <Route path="/vendors" element={<BrowseVendors />} />
              <Route path="/vendor/:id" element={<VendorPublicProfile />} />
            </Route>

            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register-vendor" element={<VendorOnboarding />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected Vendor Dashboard */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/vendor/dashboard" element={<VendorDashboard />} />
                <Route path="/vendor/bookings" element={<BookingsManager />} />
                <Route path="/vendor/packages" element={<PackageManager />} />
                <Route path="/vendor/gallery" element={<GalleryManager />} />
                <Route path="/vendor/profile" element={<VendorProfileEditor />} />
                <Route path="/vendor/settings" element={<VendorSettings />} />
              </Route>
            </Route>

            {/* Catch all redirects */}
            <Route path="/vendor/onboarding" element={<Navigate to="/register-vendor" replace />} />
            <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
