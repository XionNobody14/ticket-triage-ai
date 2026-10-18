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
} from 'lucide-react';

export default function Sidebar({ currentView, setCurrentView, openTicketsCount, onOpenTriage, isHealthy }) {
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

  return (
    <aside className="w-64 bg-slate-900/90 border-r border-slate-800 flex flex-col shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-slate-100 tracking-tight text-base">TicketTriage</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                AI
              </span>
            </div>
            <p className="text-xs text-slate-400">Enterprise Support Console</p>
          </div>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        <button
          onClick={onOpenTriage}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 hover:from-indigo-500 to-violet-600 hover:to-violet-500 text-white font-medium text-sm transition-all shadow-md shadow-indigo-600/25 active:scale-[0.98] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Simular Incidencia</span>
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-2 space-y-1">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Operaciones
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-300 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && item.badge !== undefined && (
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Multi-Agent Architecture Status */}
      <div className="p-3 m-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Agentes Autónomos
          </span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        </div>
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3 h-3 text-indigo-400" /> Coordinator
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Activo</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <Server className="w-3 h-3 text-violet-400" /> Backend & IA
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">En línea</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-amber-400" /> QA Reviewer
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">Verificado</span>
          </div>
        </div>
      </div>

      {/* System Health Footer */}
      <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isHealthy ? 'bg-emerald-500' : 'bg-rose-500'}`} />
          <span className="text-slate-400">{isHealthy ? 'API REST Conectada' : 'Desconectado'}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">v1.0</span>
      </div>
    </aside>
  );
}
