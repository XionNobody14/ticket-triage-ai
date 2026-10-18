import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldAlert,
  Bot,
  Layers,
  Award,
  Zap
} from 'lucide-react';

export default function AnalyticsView({ analytics }) {
  if (!analytics) return null;

  const total = analytics.total_tickets || 1;
  const resolvedRate = Math.round(((analytics.resolved_tickets || 0) / total) * 100);

  const urgencyColors = {
    'Crítica': 'bg-[#FDE2DB] text-[#7C3627] bar-bg-[#F87171]',
    'Alta': 'bg-[#FDE2DB] text-[#7C3627] bar-bg-[#FB923C]',
    'Media': 'bg-[#EDE6FA] text-[#503E70] bar-bg-[#A78BFA]',
    'Baja': 'bg-[#DCF3E4] text-[#2A5A3B] bar-bg-[#34D399]',
  };

  const barColorMap = {
    'Crítica': 'bg-[#E06A55]',
    'Alta': 'bg-[#E59866]',
    'Media': 'bg-[#9B8DC4]',
    'Baja': 'bg-[#52B788]',
  };

  return (
    <div className="space-y-6">
      {/* Top ROI Banner */}
      <div className="glass-card p-6 sm:p-7 rounded-3xl border border-white/80 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#7663A4] font-bold text-xs tracking-wider uppercase">
              <Zap className="w-4 h-4 text-[#8E7EB8]" />
              <span>Retorno Operativo del Pipeline Multiagente</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#2E2A36] tracking-tight">
              {analytics.estimated_hours_saved || 0} Horas de Soporte Ahorradas
            </h2>
            <p className="text-xs text-[#6C6677] max-w-xl leading-relaxed">
              Estimación basada en la reducción del tiempo de diagnóstico, búsqueda de SOPs y redacción de planes de resolución guiados por IA.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-white/70 px-6 py-4 rounded-2xl border border-white shadow-2xs w-full sm:w-auto justify-around">
            <div>
              <div className="text-[11px] text-[#6C6677] font-semibold uppercase">Tasa de Resolución</div>
              <div className="text-2xl font-bold text-[#2A5A3B] font-mono">{resolvedRate}%</div>
            </div>
            <div className="w-px h-9 bg-white" />
            <div>
              <div className="text-[11px] text-[#6C6677] font-semibold uppercase">Automatización IA</div>
              <div className="text-2xl font-bold text-[#503E70] font-mono">98.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Category Distribution */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2E2A36] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#7663A4]" />
              <span>Distribución por Dominio Corporativo</span>
            </h3>
            <span className="text-xs text-[#6C6677] font-mono">{analytics.categories?.length || 0} Categorías</span>
          </div>

          <div className="space-y-3.5">
            {analytics.categories?.map((cat) => {
              const pct = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2E2A36]">{cat.category}</span>
                    <span className="text-[#6C6677] font-mono">
                      {cat.count} tickets ({cat.resolved_count} resueltos)
                    </span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/80 overflow-hidden border border-white shadow-inner">
                    <div
                      className="h-full bg-gradient-to-r from-[#9B8DC4] to-[#7663A4] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency & Critical Breakdown */}
        <div className="glass-panel p-5 sm:p-6 rounded-3xl border border-white/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#2E2A36] flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#7C3627]" />
              <span>Distribución por Severidad</span>
            </h3>
            <span className="text-xs text-[#6C6677] font-mono">Total: {total}</span>
          </div>

          <div className="space-y-3.5">
            {analytics.urgencies?.map((u) => {
              const pct = Math.round((u.count / total) * 100);
              const barBg = barColorMap[u.urgency] || 'bg-[#9B8DC4]';
              return (
                <div key={u.urgency} className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#2E2A36]">{u.urgency}</span>
                    <span className="text-[#6C6677] font-mono">{u.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2.5 rounded-full bg-white/80 overflow-hidden border border-white shadow-inner">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Insights */}
          <div className="p-4 rounded-2xl bg-[#EDE6FA]/50 border border-white space-y-2 mt-4 text-xs shadow-2xs">
            <div className="font-bold text-[#503E70] flex items-center gap-1.5">
              <Award className="w-4 h-4 text-[#8E7EB8]" />
              <span>Conclusiones del Agente de Analítica</span>
            </div>
            <p className="text-[#6C6677] leading-relaxed">
              Las incidencias de ERP (SAP Ariba) y Bases de Datos (SQL Server) concentran el 68% de los incidentes de severidad Crítica. Se recomienda priorizar la automatización de scripts de reinicio para el túnel de SAP Cloud Connector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
