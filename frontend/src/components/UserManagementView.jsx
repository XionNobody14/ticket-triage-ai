import React, { useState, useEffect } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  User,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Clock,
  Sparkles
} from 'lucide-react';
import { fetchUsers, createUser } from '../services/api';

export default function UserManagementView() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('agent');

  const loadUsersList = async () => {
    setIsLoading(true);
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch (err) {
      console.error('Error al cargar lista de usuarios:', err);
      setErrorMsg('No se pudo cargar la lista de usuarios. Verifica tus permisos de administrador.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUsersList();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password || !fullName.trim()) return;

    setIsSubmitting(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const newUser = await createUser({
        full_name: fullName.trim(),
        email: email.trim(),
        password: password,
        role: role,
      });

      setSuccessMsg(`Usuario ${newUser.email} aprovisionado exitosamente con rol ${newUser.role === 'admin' ? 'Administrador' : 'Agente'}.`);
      setFullName('');
      setEmail('');
      setPassword('');
      setRole('agent');
      loadUsersList();
      setTimeout(() => setSuccessMsg(null), 5000);
    } catch (err) {
      console.error('Error al crear usuario:', err);
      setErrorMsg(err.message || 'Error al aprovisionar el usuario. Verifica los campos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Banner */}
      <div className="glass-panel p-6 rounded-3xl border border-white/70 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4] flex items-center justify-center text-white shadow-md shadow-[#8E7EB8]/20">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg md:text-xl font-bold text-[#2E2A36] tracking-tight">
                Gestión de Usuarios y Accesos
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/20">
                Solo Administrador
              </span>
            </div>
            <p className="text-xs text-[#6C6677] mt-0.5">
              Aprovisionamiento de credenciales corporativas y asignación de roles RBAC.
            </p>
          </div>
        </div>

        <button
          onClick={loadUsersList}
          disabled={isLoading}
          className="self-start md:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl glass-btn-secondary text-xs font-semibold cursor-pointer min-h-[40px]"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#7663A4]' : ''}`} />
          <span>Actualizar Lista</span>
        </button>
      </div>

      {/* Notifications */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-[#DCF3E4] border border-[#BDE8CB] text-[#2A5A3B] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-[#FDE2DB] border border-[#F6C5B8] text-[#7C3627] text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Grid: Create User Form + User Directory Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Column (1 col) */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-md">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/60">
              <UserPlus className="w-4 h-4 text-[#7663A4]" />
              <h3 className="font-bold text-sm text-[#2E2A36]">Aprovisionar Nuevo Usuario</h3>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E2A36] mb-1.5">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
                  <input
                    type="text"
                    required
                    placeholder="Ej. Sofia Martínez"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="glass-input w-full pl-9 pr-3 py-2 text-xs text-[#2E2A36] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E2A36] mb-1.5">
                  Correo Corporativo
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
                  <input
                    type="email"
                    required
                    placeholder="operador@xion.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="glass-input w-full pl-9 pr-3 py-2 text-xs text-[#2E2A36] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E2A36] mb-1.5">
                  Contraseña Inicial
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
                  <input
                    type="password"
                    required
                    placeholder="Mínimo 6 caracteres"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="glass-input w-full pl-9 pr-3 py-2 text-xs text-[#2E2A36] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#2E2A36] mb-1.5">
                  Rol y Permisos
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('agent')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      role === 'agent'
                        ? 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/30 shadow-xs'
                        : 'bg-white/40 text-[#6C6677] border-white/60 hover:bg-white/70'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Agente L1</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole('admin')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer border ${
                      role === 'admin'
                        ? 'bg-[#9B8DC4] text-white border-[#7663A4] shadow-xs'
                        : 'bg-white/40 text-[#6C6677] border-white/60 hover:bg-white/70'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !fullName.trim() || !email.trim() || !password}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#8E7EB8] to-[#503E70] hover:opacity-95 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Aprovisionando...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Crear Usuario Corporativo</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* User Directory Column (2 cols) */}
        <div className="lg:col-span-2">
          <div className="glass-card p-6 rounded-3xl border border-white/80 shadow-md">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/60">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#7663A4]" />
                <h3 className="font-bold text-sm text-[#2E2A36]">Directorio Corporativo</h3>
              </div>
              <span className="text-xs font-semibold text-[#6C6677] bg-white/60 px-2.5 py-0.5 rounded-full border border-white/80">
                {users.length} usuarios
              </span>
            </div>

            {isLoading ? (
              <div className="py-12 flex flex-col items-center justify-center text-[#6C6677] gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-[#7663A4]" />
                <span className="text-xs">Cargando directorio de usuarios...</span>
              </div>
            ) : users.length === 0 ? (
              <div className="py-12 text-center text-[#6C6677] text-xs">
                No hay usuarios registrados aparte del administrador.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-white/60 text-[#958FA3] font-bold uppercase tracking-wider text-[10px]">
                      <th className="pb-3 pl-2">Usuario</th>
                      <th className="pb-3 px-3">Correo</th>
                      <th className="pb-3 px-3">Rol</th>
                      <th className="pb-3 px-3">Estado</th>
                      <th className="pb-3 pr-2">Alta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/40">
                    {users.map((u) => {
                      const isAdmin = u.role === 'admin';
                      return (
                        <tr key={u.id} className="hover:bg-white/40 transition-colors">
                          <td className="py-3 pl-2">
                            <div className="flex items-center gap-2.5">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-[11px] ${
                                isAdmin ? 'bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4]' : 'bg-[#86A892]'
                              }`}>
                                {u.full_name ? u.full_name.charAt(0).toUpperCase() : u.email.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-semibold text-[#2E2A36]">{u.full_name || 'Sin nombre'}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-[#6C6677] font-mono text-[11px]">
                            {u.email}
                          </td>
                          <td className="py-3 px-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                              isAdmin
                                ? 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20'
                                : 'bg-[#DCF3E4] text-[#2A5A3B] border-[#2A5A3B]/20'
                            }`}>
                              {isAdmin ? 'Administrador' : 'Agente'}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="inline-flex items-center gap-1 text-[11px] text-[#2A5A3B]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                              <span>Activo</span>
                            </span>
                          </td>
                          <td className="py-3 pr-2 text-[#958FA3] text-[11px] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>
                              {u.created_at ? new Date(u.created_at).toLocaleDateString() : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
