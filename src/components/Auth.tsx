import React from 'react';
import { auth } from '../firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User } from 'firebase/auth';
import { Shield, Lock, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-10 text-center">
        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-8">
          <Shield size={40} />
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-2">LicitaAI</h1>
        <p className="text-slate-500 mb-10">
          Acesse a plataforma inteligente para análise de editais públicos.
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 text-slate-700 font-semibold py-4 rounded-xl hover:bg-slate-50 transition-all mb-4"
        >
          <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
          {loading ? 'Entrando...' : 'Entrar com Google'}
        </button>

        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-8">
          <Lock size={12} />
          Seus dados estão protegidos com criptografia de ponta a ponta.
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl text-center">
        <div>
          <h3 className="font-bold text-slate-900">Segurança</h3>
          <p className="text-sm text-slate-500">Autenticação segura via Google.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Privacidade</h3>
          <p className="text-sm text-slate-500">Seus editais são privados e protegidos.</p>
        </div>
        <div>
          <h3 className="font-bold text-slate-900">Suporte</h3>
          <p className="text-sm text-slate-500">Atendimento especializado 24/7.</p>
        </div>
      </div>
    </div>
  );
}
