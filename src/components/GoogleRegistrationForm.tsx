import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, User, Monitor, ShieldCheck } from 'lucide-react';

interface Platform {
  id: string;
  name: string;
  description?: string;
}

interface GoogleRegistrationFormProps {
  googleEmail: string;
  googleDisplayName: string;
  googlePhotoURL?: string;
  platforms: Platform[];
  existingUsernames: string[];
  onSubmit: (username: string, platformId: string) => Promise<void>;
  onBack: () => void;
}

const TermsModal: React.FC<{ onClose: () => void }> = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
    <div className="w-full max-w-lg bg-white border-4 border-[#0d1b2e] shadow-[10px_10px_0_0_#0d1b2e] max-h-[80vh] flex flex-col">
      <div className="p-5 border-b-2 border-[#0d1b2e] flex items-center justify-between">
        <h2 className="font-bold text-[#0d1b2e] text-base uppercase tracking-wider">Términos y Condiciones</h2>
        <button onClick={onClose} className="text-slate-500 hover:text-[#0d1b2e] font-bold text-lg leading-none cursor-pointer">✕</button>
      </div>
      <div className="overflow-y-auto p-5 text-xs text-slate-700 leading-relaxed space-y-3 flex-1">
        <p><strong>1. Uso de la Plataforma</strong><br />
        Play Code es una plataforma educativa. Al registrarte, aceptás utilizar los recursos de forma responsable, respetando a los docentes, compañeros y el contenido del curso.</p>
        <p><strong>2. Datos Personales</strong><br />
        Recopilamos tu nombre, correo electrónico y nombre de usuario para identificarte dentro de la plataforma. No compartimos tus datos con terceros.</p>
        <p><strong>3. Cuenta de Usuario</strong><br />
        Tu cuenta es personal e intransferible. No podés compartir tu acceso ni usar el de otra persona. El incumplimiento puede resultar en la suspensión de tu cuenta.</p>
        <p><strong>4. Contenido</strong><br />
        Todo el contenido de la plataforma (lecciones, videos, ejercicios) es propiedad de Play Code. No está permitida su reproducción o distribución sin autorización.</p>
        <p><strong>5. Activación de Cuenta</strong><br />
        Tu cuenta será revisada y activada por un administrador. Hasta entonces, no tendrás acceso a los materiales del curso.</p>
        <p><strong>6. Modificaciones</strong><br />
        Play Code se reserva el derecho de modificar estos términos. Te notificaremos cualquier cambio relevante.</p>
      </div>
      <div className="p-4 border-t-2 border-[#0d1b2e]">
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#0d1b2e] hover:bg-[#1e385c] text-white font-bold text-sm border-2 border-[#0d1b2e] shadow-[3px_3px_0_0_#000] active:shadow-none active:translate-x-[3px] active:translate-y-[3px] transition-all cursor-pointer"
        >
          Entendido
        </button>
      </div>
    </div>
  </div>
);

export const GoogleRegistrationForm: React.FC<GoogleRegistrationFormProps> = ({
  googleEmail,
  googleDisplayName,
  googlePhotoURL,
  platforms,
  existingUsernames,
  onSubmit,
  onBack,
}) => {
  const [username, setUsername] = useState(() =>
    (googleDisplayName || '').toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9_]/g, '').slice(0, 20)
  );
  const [platformId, setPlatformId] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const usernameClean = username.toLowerCase().replace(/\s+/g, '');
  const usernameValid = usernameClean.length >= 3 && /^[a-z0-9_]+$/.test(usernameClean);
  const usernameTaken = existingUsernames.includes(usernameClean);
  const usernameOk = usernameValid && !usernameTaken;

  const handleUsernameChange = (val: string) => {
    setUsername(val.toLowerCase().replace(/\s/g, '').replace(/[^a-z0-9_]/g, ''));
  };

  const canSubmit = usernameOk && platformId && acceptedTerms && !loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setLoading(true);
    try {
      await onSubmit(usernameClean, platformId);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error. Por favor, intentá de nuevo.');
      setLoading(false);
    }
  };

  return (
    <>
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}

      <div className="min-h-screen bg-slate-50 relative flex flex-col items-center justify-center p-4">
        {/* Pixel Grid Background */}
        <div className="absolute inset-0 opacity-10 pointer-events-none pixel-grid"></div>

        {/* Back Button */}
        <button
          onClick={onBack}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 font-bold border-2 border-slate-900 shadow-[3px_3px_0_0_#0f172a] active:shadow-[0px_0px_0_0_#0f172a] active:translate-y-[3px] active:translate-x-[3px] transition-all text-sm cursor-pointer z-10"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>

        {/* Card */}
        <div className="w-full max-w-md bg-white border-4 border-slate-900 shadow-[8px_8px_0_0_#0f172a] relative z-10">
          {/* Header con info de Google */}
          <div className="bg-[#001F4A] p-6 border-b-4 border-slate-900 text-center">
            <div className="flex items-center justify-center gap-3 mb-3">
              {googlePhotoURL ? (
                <img
                  src={googlePhotoURL}
                  alt={googleDisplayName}
                  className="w-14 h-14 rounded-full border-3 border-[#ffe66d] shadow-[3px_3px_0_0_#000]"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-14 h-14 rounded-full border-3 border-[#ffe66d] bg-[#a3b8cc]/30 flex items-center justify-center text-2xl font-bold text-white">
                  {(googleDisplayName || '?')[0].toUpperCase()}
                </div>
              )}
              <div className="text-left">
                <p className="text-white font-bold text-sm">{googleDisplayName}</p>
                <p className="text-[#a3b8cc] text-xs">{googleEmail}</p>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 bg-[#16a34a]/20 border border-[#16a34a]/50 text-[#4ade80] text-[10px] font-bold px-3 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Google verificado
            </div>
          </div>

          {/* Formulario */}
          <div className="p-6">
            <h1 className="font-bold text-[#0d1b2e] text-lg mb-1 uppercase tracking-wider">Completá tu Registro</h1>
            <p className="text-slate-500 text-xs mb-5 leading-relaxed">
              Un paso más antes de empezar. Elegí un nombre de usuario y la plataforma en la que vas a cursar.
            </p>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border-2 border-red-500 text-red-800 text-xs p-3 font-semibold rounded mb-4 leading-relaxed">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                  <User className="w-3.5 h-3.5" />
                  Nombre de Usuario
                </label>
                <div className="relative">
                  <input
                    id="reg-username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e.target.value)}
                    placeholder="mi_usuario"
                    maxLength={30}
                    className={`w-full p-3 pr-9 border-2 font-bold text-sm text-[#0d1b2e] focus:outline-none transition-colors ${
                      username.length === 0
                        ? 'border-slate-300'
                        : usernameOk
                        ? 'border-[#16a34a] bg-[#f0fdf4]'
                        : 'border-red-400 bg-red-50'
                    }`}
                    autoComplete="off"
                    spellCheck={false}
                  />
                  {username.length > 0 && (
                    <span className="absolute right-2.5 top-1/2 -translate-y-1/2">
                      {usernameOk ? (
                        <CheckCircle2 className="w-4 h-4 text-[#16a34a]" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-400" />
                      )}
                    </span>
                  )}
                </div>
                <div className="mt-1.5 text-[10px] font-semibold">
                  {username.length > 0 && !usernameValid && (
                    <p className="text-red-500">Mínimo 3 caracteres. Solo letras minúsculas, números y _</p>
                  )}
                  {usernameValid && usernameTaken && (
                    <p className="text-red-500">Este nombre de usuario ya está en uso. Elegí otro.</p>
                  )}
                  {usernameOk && (
                    <p className="text-[#16a34a]">¡Disponible! ✓</p>
                  )}
                  {username.length === 0 && (
                    <p className="text-slate-400">Solo minúsculas, números y guión bajo. Sin espacios.</p>
                  )}
                </div>
              </div>

              {/* Platform */}
              <div>
                <label className="flex items-center gap-1.5 text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mb-1.5">
                  <Monitor className="w-3.5 h-3.5" />
                  Plataforma donde vas a cursar
                </label>
                {platforms.length === 0 ? (
                  <div className="p-3 border-2 border-dashed border-slate-300 text-xs text-slate-400 font-semibold text-center rounded">
                    No hay plataformas disponibles aún. Contactá al administrador.
                  </div>
                ) : (
                  <select
                    id="reg-platform"
                    value={platformId}
                    onChange={(e) => setPlatformId(e.target.value)}
                    className="w-full p-3 border-2 border-slate-300 font-bold text-sm text-[#0d1b2e] focus:outline-none focus:border-[#2a4e7c] bg-white cursor-pointer appearance-none"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%230d1b2e' stroke-width='3'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                  >
                    <option value="">— Seleccioná una plataforma —</option>
                    {platforms.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                )}
                {platformId && (
                  <p className="mt-1 text-[10px] font-semibold text-[#2a4e7c]">
                    {platforms.find(p => p.id === platformId)?.description || ''}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div className="border-2 border-slate-200 p-3 rounded bg-slate-50">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <div className="relative mt-0.5">
                    <input
                      id="reg-terms"
                      type="checkbox"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 border-2 flex items-center justify-center transition-all cursor-pointer ${
                        acceptedTerms ? 'bg-[#0d1b2e] border-[#0d1b2e]' : 'bg-white border-slate-400'
                      }`}
                    >
                      {acceptedTerms && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 font-semibold leading-relaxed flex items-start gap-1 flex-wrap">
                    <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-[#2a4e7c] underline font-bold cursor-pointer hover:text-[#001f4a]"
                    >
                      Términos y Condiciones
                    </button>{' '}
                    de Play Code y el uso de mis datos de Google para identificarme en la plataforma.
                  </span>
                </label>
              </div>

              {/* Submit */}
              <button
                id="reg-submit"
                type="submit"
                disabled={!canSubmit}
                className="w-full py-3.5 bg-[#001f4a] hover:bg-[#002f6c] text-white font-bold text-sm border-2 border-[#0d1b2e] shadow-[4px_4px_0_0_#000000] active:shadow-[0px_0px_0_0_#000000] active:translate-y-[4px] active:translate-x-[4px] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none disabled:translate-y-0 disabled:translate-x-0 uppercase tracking-wider"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Registrando...
                  </span>
                ) : (
                  'Completar Registro →'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};
