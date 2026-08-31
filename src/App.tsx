import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import MenuPage from './pages/MenuPage'
import AboutPage from './pages/AboutPage'
import ProtectedRoute from './components/ProtectedRoute'

// Admin pages are loaded on demand only when someone visits /admin —
// public visitors never download this code.
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'))
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminMenu = lazy(() => import('./pages/admin/AdminMenu'))
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'))
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'))
const AdminAbout = lazy(() => import('./pages/admin/AdminAbout'))
const AdminSeed = lazy(() => import('./pages/admin/AdminSeed'))

function AdminFallback() {
  return (
    <div className="min-h-screen bg-cream flex items-center justify-center">
      <p className="font-body text-foreground/50">Loading...</p>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/about" element={<AboutPage />} />

      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<AdminFallback />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<AdminFallback />}>
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          </Suspense>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="menu" element={<AdminMenu />} />
        <Route path="offers" element={<AdminOffers />} />
        <Route path="gallery" element={<AdminGallery />} />
        <Route path="about" element={<AdminAbout />} />
        <Route path="seed" element={<AdminSeed />} />
      </Route>
    </Routes>
  )
}
