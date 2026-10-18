import React from 'react';
import { RefreshCw, Search, Sparkles, AlertCircle } from 'lucide-react';

export default function Header({
  searchTerm,
  setSearchTerm,
  onRefresh,
  isRefreshing,
  onOpenTriage,
  currentView
}) {
  const titles = {
    tickets: 'Bandeja de Operaciones & Triaje Agéntico',
    analytics: 'Métricas de Eficiencia y SLA',
    knowledge: 'Base de Conocimiento Corporativo (SOPs)',
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-lg font-semibold text-slate-100 tracking-tight">
            {titles[currentView] || 'Ticket Triage AI'}
          </h1>
          <p className="text-xs text-slate-400">
            Pipeline asistido por IA para clasificación, SLA y resolución guiada
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {currentView === 'tickets' && (
          <div className="relative w-64 md:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por ID, incidencia o remitente..."
              className="w-full bg-slate-950/80 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
        )}

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Actualizar datos"
          className="p-2 rounded-lg bg-slate-800/70 hover:bg-slate-700/70 text-slate-300 hover:text-white border border-slate-700/50 transition-colors disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        <button
          onClick={onOpenTriage}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-600/90 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Nuevo Ticket IA</span>
        </button>
      </div>
    </header>
  );
}
