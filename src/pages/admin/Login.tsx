import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erro ao fazer login. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface font-label-bold mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar para o portal
          </Link>
          <h2 className="text-3xl font-black text-on-surface tracking-tight uppercase">
            Muniz<span className="text-secondary">Tech</span> Admin
          </h2>
          <p className="mt-2 text-sm text-on-surface-variant font-label-bold">
            Área restrita para gerenciamento do portal
          </p>
        </div>

        <div className="bg-surface-container-lowest py-8 px-4 shadow-xl border border-surface-container-high rounded-[2rem] sm:px-10">
          <form className="space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-label-bold flex items-start gap-2">
                <span className="mt-0.5">⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="block text-sm font-black text-on-surface uppercase tracking-wider mb-2">
                E-mail
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-surface-container-high bg-surface-container-low rounded-xl focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder-on-surface-variant font-label-bold"
                  placeholder="admin@muniztech.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-black text-on-surface uppercase tracking-wider mb-2">
                Senha
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-on-surface-variant" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border-2 border-surface-container-high bg-surface-container-low rounded-xl focus:ring-0 focus:border-secondary transition-colors text-on-surface placeholder-on-surface-variant font-label-bold"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-black uppercase tracking-widest text-white bg-secondary hover:bg-secondary-fixed-variant focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                'Entrar no Painel'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
