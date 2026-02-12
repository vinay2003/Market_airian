import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/500.css';
import { AuthProvider } from '@/context/AuthContext';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';

// Vendor Pages
import VendorOnboarding from '@/pages/vendor/Onboarding';
import VendorDashboard from '@/pages/vendor/Dashboard';
import VendorPublicProfile from '@/pages/public/VendorProfile';
import BrowseVendors from '@/pages/public/BrowseVendors';
import VendorProfileEditor from '@/pages/vendor/ProfileEditor';
import PackageManager from '@/pages/vendor/PackageManager';
import GalleryManager from '@/pages/vendor/GalleryManager';
import BookingsManager from '@/pages/vendor/BookingsManager';
import VendorSettings from '@/pages/vendor/Settings';

// User Pages
import UserOnboarding from '@/pages/user/Onboarding';
import UserDashboard from '@/pages/user/Dashboard';
import UserBookings from '@/pages/user/Bookings';
import UserSettings from '@/pages/user/Settings';

// Layout & Components
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PublicLayout } from '@/components/layout/PublicLayout';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
