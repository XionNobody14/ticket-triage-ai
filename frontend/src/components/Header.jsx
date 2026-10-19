import React from 'react';
import { RefreshCw, Search, Sparkles, Menu, LogOut, ShieldCheck, Shield } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onRefresh,
  isRefreshing,
  onOpenTriage,
  currentView,
  onToggleMobileMenu,
  currentUser,
  onLogout
}) {
  const titles = {
    tickets: 'Bandeja de Operaciones',
    analytics: 'Analítica Operacional',
    knowledge: 'Base de Conocimiento',
    users: 'Gestión de Usuarios',
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <header className="h-16 border-b border-white/60 glass-panel px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile Hamburger Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="md:hidden p-2 rounded-xl bg-white/60 hover:bg-white text-[#2E2A36] border border-white/80 transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
          aria-label="Abrir menú de navegación"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm md:text-base font-bold text-[#2E2A36] tracking-tight">
            {titles[currentView] || 'Ticket Triage AI'}
          </h1>
          <p className="text-[11px] text-[#6C6677] hidden sm:block">
            Triaje agéntico y documentación asistida por IA
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        {currentView === 'tickets' && (
          <div className="relative w-36 sm:w-56 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar tickets..."
              className="w-full glass-input pl-8 pr-3 py-1.5 text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-hidden"
            />
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Actualizar datos"
          className="p-2.5 rounded-xl glass-btn-secondary text-[#6C6677] hover:text-[#2E2A36] transition-colors disabled:opacity-50 cursor-pointer min-w-[40px] min-h-[40px] flex items-center justify-center shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#7663A4]' : ''}`} />
        </button>

        <button
          onClick={onOpenTriage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-btn-primary text-xs font-medium cursor-pointer min-h-[40px] shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo Ticket IA</span>
        </button>

        {/* User Profile & Logout Button */}
        {currentUser && (
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-white/60">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-xs ${
                isAdmin ? 'bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4]' : 'bg-[#86A892]'
              }`}>
                {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-xs font-bold text-[#2E2A36] leading-tight">
                  {currentUser.full_name || currentUser.email.split('@')[0]}
                </p>
                <p className="text-[10px] text-[#6C6677]">
                  {isAdmin ? 'Administrador' : 'Agente L1'}
                </p>
              </div>
            </div>

            <button
              onClick={onLogout}
              title="Cerrar Sesión Corporativa"
              className="p-2 rounded-xl text-[#6C6677] hover:text-[#7C3627] hover:bg-[#FDE2DB]/70 transition-colors cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center"
              aria-label="Cerrar sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
