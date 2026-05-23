import { useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { Leaf, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login, isAuthenticated, loading } = useAuth();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && isAuthenticated) return <Navigate to="/admin/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) { setError('Username dan password wajib diisi.'); return; }
    setSubmitting(true);
    setError('');
    const result = await login(form.username, form.password);
    if (!result.success) setError(result.error || 'Login gagal.');
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bumdes-900 via-bumdes-800 to-bumdes-700 flex items-center justify-center p-4">
      {/* Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-bumdes-500/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-bumdes-accent/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-bumdes-700 to-bumdes-600 p-8 text-white text-center">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <h1 className="font-jakarta font-bold text-2xl">Portal Admin</h1>
            <p className="text-green-200 text-sm mt-1">BUMDes Mitra Sejahtera</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <h2 className="font-jakarta font-bold text-xl text-gray-800 mb-6">Masuk ke Dashboard</h2>

            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label htmlFor="admin-username" className="form-label">Username</label>
                <input
                  id="admin-username"
                  type="text"
                  autoComplete="username"
                  placeholder="Masukkan username"
                  value={form.username}
                  onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
                  className="form-input"
                />
              </div>
              <div>
                <label htmlFor="admin-password" className="form-label">Password</label>
                <div className="relative">
                  <input
                    id="admin-password"
                    type={showPw ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                    className="form-input pr-12"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={showPw ? 'Sembunyikan password' : 'Tampilkan password'}>
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <button type="submit" id="admin-login-btn" disabled={submitting} className="btn-primary w-full justify-center">
                {submitting ? (
                  <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Memproses...</span>
                ) : (
                  <><LogIn className="w-4 h-4" /> Masuk</>
                )}
              </button>
            </form>
            <div className="mt-5 text-center">
              <Link to="/" className="text-sm text-bumdes-600 hover:text-bumdes-800 transition-colors">
                ← Kembali ke Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
