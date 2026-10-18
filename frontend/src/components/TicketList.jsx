import React, { useState } from 'react';
import {
  LayoutList,
  Kanban,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Shield,
  Layers
} from 'lucide-react';

export default function TicketList({
  tickets,
  selectedUrgency,
  setSelectedUrgency,
  selectedStatus,
  setSelectedStatus,
  selectedCategory,
  setSelectedCategory,
  onSelectTicket,
  onUpdateStatus,
  categories
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'kanban'

  const urgencyPills = {
    'Crítica': 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    'Alta': 'bg-amber-500/15 text-amber-300 border-amber-500/30',
    'Media': 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    'Baja': 'bg-slate-500/15 text-slate-300 border-slate-500/30',
  };

  const statusPills = {
    'Abierto': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'En Proceso': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    'Resuelto': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };

  const kanbanColumns = [
    { id: 'Abierto', label: 'Tickets Abiertos', icon: AlertCircle, color: 'text-amber-400', border: 'border-amber-500/30' },
    { id: 'En Proceso', label: 'En Mitigación', icon: Clock, color: 'text-indigo-400', border: 'border-indigo-500/30' },
    { id: 'Resuelto', label: 'Resueltos & Cerrados', icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/30' },
  ];

  return (
    <div className="space-y-4">
      {/* Controls and Filters Toolbar */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
          {['Todos', 'Abierto', 'En Proceso', 'Resuelto'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedStatus === st
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Filters dropdowns and View switch */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="Todas">Urgencia: Todas</option>
              <option value="Crítica">🔴 Crítica</option>
              <option value="Alta">🟠 Alta</option>
              <option value="Media">🔵 Media</option>
              <option value="Baja">⚪ Baja</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer max-w-[170px]"
          >
            <option value="Todas">Categoría: Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-slate-950/60 p-1 rounded-lg border border-slate-800/80">
            <button
              onClick={() => setViewMode('table')}
              title="Vista de Tabla"
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                viewMode === 'table' ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              title="Vista Tablero Kanban"
              className={`p-1.5 rounded-md text-xs cursor-pointer ${
                viewMode === 'kanban' ? 'bg-slate-800 text-indigo-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content View: Table or Kanban */}
      {tickets.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-2xl">
          <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300 mb-1">No se encontraron tickets</h3>
          <p className="text-xs text-slate-400">
            Prueba ajustando los filtros o simula una nueva incidencia con el botón superior.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* DENSE TABLE VIEW */
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 border-b border-slate-800/80 text-[11px] uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Incidencia / Título</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold">Urgencia</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Confianza IA</th>
                  <th className="py-3 px-4 font-semibold">Equipo Asignado</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-slate-400 font-medium">
                      #{ticket.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-md">
                      <div className="font-medium text-slate-200 group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
                        <Layers className="w-3 h-3 text-slate-400" />
                        {ticket.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${urgencyPills[ticket.urgency] || urgencyPills['Media']}`}>
                        {ticket.urgency}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusPills[ticket.status] || statusPills['Abierto']}`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="font-mono text-slate-300 font-medium">
                          {Math.round((ticket.confidence_score || 0.85) * 100)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {ticket.assigned_team || 'L1-Helpdesk'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-indigo-600/30 text-slate-300 hover:text-indigo-300 border border-slate-700 hover:border-indigo-500/40 text-xs font-medium transition-colors cursor-pointer"
                      >
                        <span>Revisar</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kanbanColumns.map((col) => {
            const ColIcon = col.icon;
            const columnTickets = tickets.filter((t) => t.status === col.id);

            return (
              <div
                key={col.id}
                className="bg-slate-900/50 border border-slate-800 rounded-2xl p-3 flex flex-col min-h-[500px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ColIcon className={`w-4 h-4 ${col.color}`} />
                    <span className="text-xs font-semibold text-slate-200">{col.label}</span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono font-medium rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                    {columnTickets.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[680px] pr-1">
                  {columnTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => onSelectTicket(ticket)}
                      className="bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-xl p-3.5 transition-all shadow-sm hover:shadow-indigo-500/5 cursor-pointer group space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">#{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${urgencyPills[ticket.urgency]}`}>
                          {ticket.urgency}
                        </span>
                      </div>

                      <h4 className="text-xs font-semibold text-slate-200 group-hover:text-indigo-300 line-clamp-2 transition-colors">
                        {ticket.title}
                      </h4>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {ticket.description}
                      </p>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
                        <span className="text-slate-400 truncate max-w-[130px]">
                          {ticket.assigned_team}
                        </span>

                        {col.id === 'Abierto' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(ticket.id, 'En Proceso');
                            }}
                            className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                          >
                            <span>Iniciar</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}

                        {col.id === 'En Proceso' && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateStatus(ticket.id, 'Resuelto');
                            }}
                            className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-medium cursor-pointer"
                          >
                            <span>Resolver</span>
                            <CheckCircle2 className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  {columnTickets.length === 0 && (
                    <div className="text-center py-10 text-xs text-slate-400 border border-dashed border-slate-800/60 rounded-xl">
                      Sin tickets en este estado
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
