import React from 'react';
import { RefreshCw, Search, Sparkles, Menu } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onRefresh,
  isRefreshing,
  onOpenTriage,
  currentView,
  onToggleMobileMenu
}) {
  const titles = {
    tickets: 'Bandeja de Operaciones',
    analytics: 'Analítica Operacional',
    knowledge: 'Base de Conocimiento',
  };

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
          <div className="relative w-40 sm:w-60 md:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar..."
              className="w-full glass-input pl-8 pr-3 py-1.5 text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none"
            />
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Actualizar datos"
          className="p-2.5 rounded-xl glass-btn-secondary text-[#6C6677] hover:text-[#2E2A36] transition-colors disabled:opacity-50 cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#7663A4]' : ''}`} />
        </button>

        <button
          onClick={onOpenTriage}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl glass-btn-primary text-xs font-medium cursor-pointer min-h-[44px] shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo Ticket IA</span>
        </button>
      </div>
    </header>
  );
}
