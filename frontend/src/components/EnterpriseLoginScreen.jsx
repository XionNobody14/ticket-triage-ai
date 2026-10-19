import React, { useState } from 'react';
import { Building2, Lock, Mail, ArrowRight, ShieldAlert, Loader2, KeyRound } from 'lucide-react';
import { loginUser } from '../services/api';

export default function EnterpriseLoginScreen({ onLoginSuccess, onSwitchAccessKey }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const data = await loginUser({
        email: email.trim(),
        password: password,
      });

      // Persistir token y datos de usuario en sessionStorage
      sessionStorage.setItem('auth_token', data.token);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
    } catch (err) {
      console.error('Error de autenticación corporativa:', err);
      setErrorMessage(err.message || 'Credenciales inválidas. Verifica tu correo y contraseña corporativa.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient orbs estilo Neu-Natural Glass */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9B8DC4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#86A892]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/80 relative z-10 animate-in fade-in zoom-in-95 duration-300">
        {/* Brand Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4] border border-white/80 flex items-center justify-center mx-auto shadow-md shadow-[#8E7EB8]/20 text-white">
          <Building2 className="w-8 h-8" />
        </div>

        {/* Header Texts */}
        <div className="mt-5 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/20">
            <Lock className="w-3.5 h-3.5" /> Portal de Acceso Empresarial
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2E2A36] tracking-tight mt-3">
            Iniciar Sesión Corporativa
          </h1>
          <p className="text-sm font-medium text-[#6C6677] mt-1.5">
            Consola Multiagente de Soporte y Triaje
          </p>
          <p className="text-xs text-[#6C6677]/80 mt-2.5 leading-relaxed">
            Acceso restringido para personal autorizado. Las cuentas son aprovisionadas internamente por la organización.
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mt-4 p-3.5 rounded-xl bg-[#FDE2DB] border border-[#F6C5B8] text-[#7C3627] text-xs font-semibold flex items-center gap-2.5 animate-shake">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Corporate Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#2E2A36] uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958FA3]" />
              <input
                type="email"
                required
                autoComplete="off"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-3 text-sm text-[#2E2A36] placeholder-[#958FA3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2E2A36] uppercase tracking-wider mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#958FA3]" />
              <input
                type="password"
                required
                autoComplete="off"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-input w-full pl-10 pr-4 py-3 text-sm text-[#2E2A36] placeholder-[#958FA3] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
                disabled={isLoading}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !email.trim() || !password}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8E7EB8] to-[#503E70] hover:opacity-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </>
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info & Change Key link */}
        <div className="mt-6 pt-5 border-t border-white/50 flex items-center justify-between text-[11px] text-[#6C6677]">
          <span className="font-mono">Control de Acceso RBAC</span>
          {onSwitchAccessKey && (
            <button
              onClick={onSwitchAccessKey}
              type="button"
              className="inline-flex items-center gap-1 text-[#7663A4] hover:text-[#503E70] font-medium transition-colors cursor-pointer"
            >
              <KeyRound className="w-3 h-3" />
              <span>Cambiar clave demo</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
