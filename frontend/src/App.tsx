import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import '@fontsource/inter/400.css';
import '@fontsource/inter/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/500.css';
import { AuthProvider } from '@/context/AuthContext';
import Landing from '@/pages/Landing';
import Login from '@/pages/auth/Login';
import VendorOnboarding from '@/pages/vendor/Onboarding';
import VendorDashboard from '@/pages/vendor/Dashboard';
import VendorPublicProfile from '@/pages/public/VendorProfile';
import UserOnboarding from '@/pages/user/Onboarding';
import UserDashboard from '@/pages/user/Dashboard';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute allowedRoles={['user', 'vendor']} />}>
            <Route path="/vendor/onboarding" element={<VendorOnboarding />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={['vendor']} />}>
            <Route path="/vendor/dashboard" element={<VendorDashboard />} />
            <Route path="/vendor" element={<Navigate to="/vendor/dashboard" replace />} />
          </Route>

          <Route path="/vendor/:id" element={<VendorPublicProfile />} />

          <Route element={<ProtectedRoute allowedRoles={['user']} />}>
            <Route path="/user/onboarding" element={<UserOnboarding />} />
            <Route path="/dashboard" element={<UserDashboard />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
