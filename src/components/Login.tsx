import React, { useState } from 'react';
import { Code2, ArrowLeft } from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

interface LoginProps {
  onLogin: (email: string, password?: string, name?: string) => { success: boolean; error?: string };
  onBack: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onBack }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      if (user && user.email) {
        const res = onLogin(user.email, undefined, user.displayName || user.email.split('@')[0]);
        if (!res.success) {
          setError(res.error || 'Acceso denegado.');
        }
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/popup-blocked') {
        setError('El navegador bloqueó la ventana emergente de inicio de sesión. Por favor, permite ventanas emergentes para este sitio.');
      } else if (err.code === 'auth/configuration-not-found') {
        setError('Error de configuración en Firebase: Verifica que el proveedor de Google esté habilitado en la consola de Firebase.');
      } else {
        setError('Ocurrió un error al intentar conectar con Google. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !passwordInput) {
      setError('Por favor, ingresa tu usuario y contraseña.');
      return;
    }
    setLoading(true);
    setError('');
    const res = onLogin(emailInput.trim(), passwordInput);
    setLoading(false);
    if (!res.success) {
      setError(res.error || 'Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col items-center justify-center p-4">
      {/* Pixel Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none pixel-grid"></div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[3px] active:translate-x-[3px] transition-all text-sm cursor-pointer z-10"
      >
        <ArrowLeft className="w-4 h-4" /> Volver al Inicio
      </button>

      {/* Login Card */}
      <div className="w-full max-w-md bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] p-8 relative z-10">
        <div className="text-center mb-6">
          <div className="inline-flex bg-[#001F4A] p-3 border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] text-[#F2900F] mb-4">
            <Code2 className="w-8 h-8" />
          </div>
          <h1 className="font-pixel text-xl sm:text-2xl text-slate-900 tracking-wide mb-2">Play Code</h1>
          <p className="text-slate-650 font-semibold text-xs uppercase tracking-wider">Plataforma Educativa</p>
        </div>

        <div className="space-y-5">
          {error && (
            <div className="bg-red-50 border-2 border-red-500 text-red-900 text-xs p-3 font-semibold rounded leading-relaxed">
              {error}
            </div>
          )}

          {/* Google Sign-in */}
          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-900 font-bold border-3 border-slate-900 shadow-[4px_4px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[4px] active:translate-x-[4px] transition-all flex items-center justify-center gap-3 cursor-pointer text-sm disabled:opacity-50"
          >
            {/* Google Icon Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? 'Conectando...' : 'Conectar con Google'}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t-2 border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 font-bold text-[9px] uppercase tracking-widest">o ingresar con contraseña</span>
            <div className="flex-grow border-t-2 border-slate-200"></div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleManualLogin} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-slate-500 block mb-1">Usuario o Correo Electrónico</label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full p-2.5 border-2 border-slate-350 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold"
              />
            </div>

            <div>
              <label className="font-bold text-slate-500 block mb-1">Contraseña</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 border-2 border-slate-350 rounded focus:outline-none focus:ring-1 focus:ring-[#2a4e7c] text-slate-900 font-semibold"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#001f4a] hover:bg-[#002f6c] text-white font-bold border-3 border-slate-900 shadow-[4px_4px_0_0_#001f4a] active:shadow-[0px_0px_0_0_#001f4a] active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer text-sm disabled:opacity-50 mt-2"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>

        <div className="mt-8 border-t-2 border-slate-100 pt-6 text-center">
          <p className="text-[10px] text-slate-450 font-medium">
            Al iniciar sesión, aceptas nuestras políticas de Ciudadanía Digital y uso seguro de datos.
          </p>
        </div>
      </div>
    </div>
  );
};
