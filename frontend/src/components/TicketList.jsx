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
  const [mobileKanbanTab, setMobileKanbanTab] = useState('Abierto'); // 'Abierto' | 'En Proceso' | 'Resuelto'

  const urgencyPills = {
    'Crítica': 'bg-[#FDE2DB] text-[#7C3627] border-[#7C3627]/20',
    'Alta': 'bg-[#FDE2DB] text-[#7C3627] border-[#7C3627]/20',
    'Media': 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20',
    'Baja': 'bg-[#DCF3E4] text-[#2A5A3B] border-[#2A5A3B]/20',
  };

  const statusPills = {
    'Abierto': 'bg-[#FFF3DD] text-[#8F5700] border-[#8F5700]/20',
    'En Proceso': 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20',
    'Resuelto': 'bg-[#DCF3E4] text-[#2A5A3B] border-[#2A5A3B]/20',
  };

  const kanbanColumns = [
    { id: 'Abierto', label: 'Abiertos', icon: AlertCircle, color: 'text-[#8F5700]', bg: 'bg-[#FFF3DD]' },
    { id: 'En Proceso', label: 'En Proceso', icon: Clock, color: 'text-[#503E70]', bg: 'bg-[#EDE6FA]' },
    { id: 'Resuelto', label: 'Resueltos', icon: CheckCircle2, color: 'text-[#2A5A3B]', bg: 'bg-[#DCF3E4]' },
  ];

  return (
    <div className="space-y-4">
      {/* Controls and Filters Toolbar */}
      <div className="glass-panel rounded-2xl p-3 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-xs">
        {/* Status Pills */}
        <div className="flex items-center gap-1 bg-white/60 p-1 rounded-xl border border-white/80 overflow-x-auto">
          {['Todos', 'Abierto', 'En Proceso', 'Resuelto'].map((st) => (
            <button
              key={st}
              onClick={() => setSelectedStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap min-h-[36px] flex items-center justify-center ${
                selectedStatus === st
                  ? 'bg-white text-[#503E70] font-semibold shadow-xs'
                  : 'text-[#6C6677] hover:text-[#2E2A36]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Filters Dropdowns and View Switch */}
        <div className="flex items-center gap-2 flex-wrap justify-between md:justify-end">
          {/* Urgency Filter */}
          <div className="flex items-center gap-1.5">
            <select
              value={selectedUrgency}
              onChange={(e) => setSelectedUrgency(e.target.value)}
              className="glass-input px-2.5 py-1.5 text-xs text-[#2E2A36] focus:outline-none cursor-pointer min-h-[38px]"
            >
              <option value="Todas">Urgencia: Todas</option>
              <option value="Crítica">🔴 Crítica</option>
              <option value="Alta">🟠 Alta</option>
              <option value="Media">🟣 Media</option>
              <option value="Baja">🟢 Baja</option>
            </select>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="glass-input px-2.5 py-1.5 text-xs text-[#2E2A36] focus:outline-none cursor-pointer max-w-[160px] min-h-[38px]"
          >
            <option value="Todas">Categoría: Todas</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center bg-white/60 p-1 rounded-xl border border-white/80">
            <button
              onClick={() => setViewMode('table')}
              title="Vista de Tabla"
              className={`p-2 rounded-lg text-xs cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                viewMode === 'table' ? 'bg-white text-[#503E70] shadow-xs' : 'text-[#6C6677] hover:text-[#2E2A36]'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('kanban')}
              title="Vista Tablero Kanban"
              className={`p-2 rounded-lg text-xs cursor-pointer min-w-[36px] min-h-[36px] flex items-center justify-center ${
                viewMode === 'kanban' ? 'bg-white text-[#503E70] shadow-xs' : 'text-[#6C6677] hover:text-[#2E2A36]'
              }`}
            >
              <Kanban className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Content View: Table or Kanban */}
      {tickets.length === 0 ? (
        <div className="p-12 text-center glass-panel rounded-2xl">
          <AlertCircle className="w-8 h-8 text-[#958FA3] mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-[#2E2A36] mb-1">No se encontraron tickets</h3>
          <p className="text-xs text-[#6C6677]">
            Prueba ajustando los filtros o simula una nueva incidencia con el botón superior.
          </p>
        </div>
      ) : viewMode === 'table' ? (
        /* DENSE TABLE VIEW (Responsive with Horizontal Scroll and Rounded Glass Borders) */
        <div className="glass-panel rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead className="bg-white/60 border-b border-white/80 text-[11px] uppercase tracking-wider text-[#6C6677]">
                <tr>
                  <th className="py-3 px-4 font-semibold">ID</th>
                  <th className="py-3 px-4 font-semibold">Incidencia / Título</th>
                  <th className="py-3 px-4 font-semibold">Categoría</th>
                  <th className="py-3 px-4 font-semibold">Urgencia</th>
                  <th className="py-3 px-4 font-semibold">Estado</th>
                  <th className="py-3 px-4 font-semibold">Confianza IA</th>
                  <th className="py-3 px-4 font-semibold">Equipo</th>
                  <th className="py-3 px-4 font-semibold text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/60">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => onSelectTicket(ticket)}
                    className="hover:bg-white/60 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[#6C6677] font-semibold">
                      #{ticket.id}
                    </td>
                    <td className="py-3.5 px-4 max-w-xs md:max-w-md">
                      <div className="font-semibold text-[#2E2A36] group-hover:text-[#503E70] transition-colors line-clamp-1">
                        {ticket.title}
                      </div>
                      <div className="text-[11px] text-[#6C6677] line-clamp-1 mt-0.5">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium bg-white/70 text-[#503E70] border border-white/90 shadow-2xs">
                        <Layers className="w-3 h-3 text-[#958FA3]" />
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
                      <div className="flex items-center gap-1.5 font-mono text-[#503E70] font-semibold">
                        <Sparkles className="w-3.5 h-3.5 text-[#8E7EB8]" />
                        <span>{Math.round((ticket.confidence_score || 0.85) * 100)}%</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#6C6677]">
                      {ticket.assigned_team || 'L1-Helpdesk'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTicket(ticket);
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl glass-btn-secondary text-xs font-medium cursor-pointer shadow-2xs"
                      >
                        <span>Revisar</span>
                        <ChevronRight className="w-3 h-3 text-[#958FA3]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* KANBAN BOARD VIEW (Desktop 3 Columns, Mobile Responsive Tab Switcher) */
        <div className="space-y-4">
          {/* Mobile Tab Switcher for Kanban (<= 768px) */}
          <div className="md:hidden flex items-center justify-between p-1 bg-white/70 rounded-2xl border border-white/80 shadow-xs">
            {kanbanColumns.map((col) => {
              const count = tickets.filter((t) => t.status === col.id).length;
              const isActive = mobileKanbanTab === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => setMobileKanbanTab(col.id)}
                  className={`flex-1 py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer min-h-[44px] ${
                    isActive
                      ? 'bg-white text-[#503E70] shadow-sm border border-white/90'
                      : 'text-[#6C6677] hover:text-[#2E2A36]'
                  }`}
                >
                  <span>{col.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${col.bg} ${col.color}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Kanban Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {kanbanColumns.map((col) => {
              const ColIcon = col.icon;
              const columnTickets = tickets.filter((t) => t.status === col.id);
              const isVisibleOnMobile = mobileKanbanTab === col.id;

              return (
                <div
                  key={col.id}
                  className={`glass-panel rounded-2xl p-3.5 flex-col min-h-[420px] shadow-xs ${
                    isVisibleOnMobile ? 'flex' : 'hidden md:flex'
                  }`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/60">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg ${col.bg} flex items-center justify-center ${col.color}`}>
                        <ColIcon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-[#2E2A36]">{col.label}</span>
                    </div>
                    <span className="px-2 py-0.5 text-xs font-mono font-semibold rounded-full bg-white text-[#503E70] border border-white/80 shadow-2xs">
                      {columnTickets.length}
                    </span>
                  </div>

                  {/* Cards Container */}
                  <div className="space-y-3 flex-1 overflow-y-auto max-h-[640px] pr-0.5">
                    {columnTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => onSelectTicket(ticket)}
                        className="glass-card p-4 transition-all cursor-pointer group space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono text-[#6C6677] font-semibold">#{ticket.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${urgencyPills[ticket.urgency]}`}>
                            {ticket.urgency}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-[#2E2A36] group-hover:text-[#503E70] line-clamp-2 transition-colors">
                          {ticket.title}
                        </h4>

                        <p className="text-[11px] text-[#6C6677] line-clamp-2 leading-relaxed">
                          {ticket.description}
                        </p>

                        <div className="flex items-center justify-between pt-2 border-t border-white/60 text-[11px] text-[#6C6677]">
                          <span className="truncate max-w-[130px] font-medium text-[#958FA3]">
                            {ticket.assigned_team}
                          </span>

                          {col.id === 'Abierto' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(ticket.id, 'En Proceso');
                              }}
                              className="flex items-center gap-1 text-[11px] text-[#503E70] font-semibold hover:underline cursor-pointer min-h-[36px]"
                            >
                              <span>Iniciar</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {col.id === 'En Proceso' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onUpdateStatus(ticket.id, 'Resuelto');
                              }}
                              className="flex items-center gap-1 text-[11px] text-[#2A5A3B] font-semibold hover:underline cursor-pointer min-h-[36px]"
                            >
                              <span>Resolver</span>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}

                    {columnTickets.length === 0 && (
                      <div className="text-center py-12 text-xs text-[#958FA3] border border-dashed border-white/80 rounded-2xl bg-white/20">
                        Sin tickets en esta columna
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
