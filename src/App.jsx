import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { NewsProvider } from './context/NewsContext';
import { ProductProvider } from './context/ProductContext';
import ProtectedRoute from './admin/ProtectedRoute';

// Public Pages
import Home from './pages/Home';
import NewsList from './pages/NewsList';
import NewsDetail from './pages/NewsDetail';
import NotFound from './pages/NotFound';

// Admin Pages
import AdminLogin from './admin/Login';
import Dashboard from './admin/Dashboard';
import NewsManager from './admin/NewsManager';
import NewsForm from './admin/NewsForm';
import ProductManager from './admin/ProductManager';
import AdminSettings from './admin/AdminSettings';
import OrganizationManager from './admin/OrganizationManager';

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bumdes-50">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-3 border-bumdes-700 border-t-transparent rounded-full animate-spin" style={{ borderWidth: '3px' }} />
        <p className="text-bumdes-700 font-medium text-sm">Memuat...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NewsProvider>
        <ProductProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Home />} />
              <Route path="/berita" element={<NewsList />} />
              <Route path="/berita/:slug" element={<NewsDetail />} />

              {/* Admin - public */}
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/login" element={<AdminLogin />} />

              {/* Admin - protected */}
              <Route path="/admin/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin/berita" element={<ProtectedRoute><NewsManager /></ProtectedRoute>} />
              <Route path="/admin/berita/baru" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
              <Route path="/admin/berita/:id/edit" element={<ProtectedRoute><NewsForm /></ProtectedRoute>} />
              <Route path="/admin/produk" element={<ProtectedRoute><ProductManager /></ProtectedRoute>} />
              <Route path="/admin/pengurus" element={<ProtectedRoute><OrganizationManager /></ProtectedRoute>} />
              <Route path="/admin/pengaturan" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        </ProductProvider>
      </NewsProvider>
    </AuthProvider>
  );
}
