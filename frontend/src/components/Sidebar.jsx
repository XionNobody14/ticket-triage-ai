import React from 'react';
import {
  Inbox,
  BarChart3,
  BookOpen,
  PlusCircle,
  Cpu,
  ShieldCheck,
  Server,
  Zap,
  X,
  Users,
  LogOut,
  Shield
} from 'lucide-react';

export default function Sidebar({
  currentView,
  setCurrentView,
  openTicketsCount,
  onOpenTriage,
  isHealthy,
  currentUser,
  onLogout,
  mobileOpen = false,
  setMobileOpen = () => {}
}) {
  const isAdmin = currentUser?.role === 'admin';

  const navItems = [
    {
      id: 'tickets',
      label: 'Tickets Entrantes',
      icon: Inbox,
      badge: openTicketsCount > 0 ? openTicketsCount : null,
    },
    {
      id: 'analytics',
      label: 'Analítica Operacional',
      icon: BarChart3,
    },
    {
      id: 'knowledge',
      label: 'Base de Conocimiento',
      icon: BookOpen,
    },
  ];

  // Pestaña adicional de Gestión de Usuarios exclusiva para administradores
  if (isAdmin) {
    navItems.push({
      id: 'users',
      label: 'Gestión de Usuarios',
      icon: Users,
      badge: 'Admin',
    });
  }

  const handleNavClick = (viewId) => {
    setCurrentView(viewId);
    setMobileOpen(false);
  };

  const handleTriageClick = () => {
    onOpenTriage();
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none p-4">
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between pb-4 mb-3 border-b border-white/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4] flex items-center justify-center shadow-md shadow-[#8E7EB8]/20">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-[#2E2A36] tracking-tight text-base">TicketTriage</span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/15">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-[#6C6677]">Neu-Natural Console</p>
            </div>
          </div>

          {/* Close button on mobile drawer */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-2 rounded-xl bg-white/60 hover:bg-white text-[#6C6677] hover:text-[#2E2A36] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Cerrar menú"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="mb-4">
          <button
            onClick={handleTriageClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl glass-btn-primary font-medium text-sm transition-all active:scale-[0.98] cursor-pointer min-h-[44px]"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Simular Incidencia</span>
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          <div className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wider text-[#958FA3]">
            Operaciones
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-medium transition-all cursor-pointer min-h-[44px] ${
                  isActive
                    ? 'bg-white/80 text-[#503E70] shadow-sm border border-white/80 font-semibold'
                    : 'text-[#6C6677] hover:text-[#2E2A36] hover:bg-white/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#7663A4]' : 'text-[#958FA3]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== null && item.badge !== undefined && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    item.badge === 'Admin'
                      ? 'bg-[#9B8DC4] text-white border-[#7663A4]'
                      : 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Multi-Agent Architecture Status & Current User Card */}
      <div className="space-y-3 pt-4">
        {/* Current Authenticated User Box */}
        {currentUser && (
          <div className="p-3 rounded-2xl bg-white/55 border border-white/80 shadow-xs">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 ${
                  isAdmin ? 'bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4]' : 'bg-[#86A892]'
                }`}>
                  {currentUser.full_name ? currentUser.full_name.charAt(0).toUpperCase() : currentUser.email.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#2E2A36] truncate leading-tight">
                    {currentUser.full_name || currentUser.email}
                  </p>
                  <p className="text-[10px] text-[#6C6677] truncate">
                    {currentUser.email}
                  </p>
                </div>
              </div>
              <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider shrink-0 border ${
                isAdmin
                  ? 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20'
                  : 'bg-[#DCF3E4] text-[#2A5A3B] border-[#2A5A3B]/20'
              }`}>
                {isAdmin ? 'Admin' : 'Agente'}
              </span>
            </div>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-semibold text-[#7C3627] hover:bg-[#FDE2DB]/60 border border-transparent hover:border-[#F6C5B8] transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        )}

        {/* Multi-Agent Pill */}
        <div className="p-3 rounded-2xl bg-white/40 border border-white/70 shadow-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-[#6C6677] uppercase tracking-wider">
              Pipeline Autónomo
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#34D399] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
            </span>
          </div>
          <div className="text-[10px] text-[#6C6677] flex items-center justify-between">
            <span>IA Triaje & SOPs</span>
            <span className="text-[#2A5A3B] bg-[#DCF3E4] px-1.5 py-0.2 rounded font-mono font-semibold">Listo</span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-1 px-1 text-xs text-[#6C6677] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-[#10B981]' : 'bg-[#EF4444]'}`} />
            <span className="text-[11px] text-[#6C6677]">{isHealthy ? 'API Conectada' : 'Desconectado'}</span>
          </div>
          <span className="text-[10px] text-[#958FA3] font-mono">v1.3 Enterprise</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex w-64 glass-panel border-r border-white/60 flex-col shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-[#2E2A36]/30 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Panel */}
      <div
        className={`fixed inset-y-0 left-0 w-72 max-w-[85vw] glass-modal z-50 md:hidden shadow-2xl transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
}
