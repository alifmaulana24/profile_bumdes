import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bumdes-50">
        <div className="flex items-center gap-3 text-bumdes-700">
          <div className="w-6 h-6 border-2 border-bumdes-700 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Memeriksa sesi...</span>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
