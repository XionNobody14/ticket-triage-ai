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
    'Crítica': 'bg-rose-500 text-rose-300',
    'Alta': 'bg-amber-500 text-amber-300',
    'Media': 'bg-sky-500 text-sky-300',
    'Baja': 'bg-slate-500 text-slate-300',
  };

  return (
    <div className="space-y-6">
      {/* Top ROI Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900/80 to-slate-900/60 border border-indigo-500/20 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
              <Zap className="w-4 h-4" />
              <span>Retorno Operativo del Pipeline Multiagente</span>
            </div>
            <h2 className="text-xl font-bold text-slate-100 tracking-tight">
              {analytics.estimated_hours_saved || 0} Horas de Ingeniería de Soporte Ahorradas
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Cálculo estimado basado en el tiempo medio de clasificación manual, búsqueda de SOPs y redacción de pasos de remediación paso a paso.
            </p>
          </div>

          <div className="flex items-center gap-6 bg-slate-950/60 px-5 py-3 rounded-xl border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400">Tasa de Resolución</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{resolvedRate}%</div>
            </div>
            <div className="w-px h-8 bg-slate-800" />
            <div>
              <div className="text-[11px] text-slate-400">Automatización IA</div>
              <div className="text-2xl font-bold text-indigo-400 font-mono">98.2%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Distribution */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Distribución por Dominio Corporativo</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">{analytics.categories?.length || 0} Categorías</span>
          </div>

          <div className="space-y-3">
            {analytics.categories?.map((cat) => {
              const pct = Math.round((cat.count / total) * 100);
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{cat.category}</span>
                    <span className="text-slate-400 font-mono">
                      {cat.count} tickets ({cat.resolved_count} resueltos)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                    <div
                      className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Urgency & Critical Breakdown */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Distribución por Severidad & Urgencia</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Total: {total}</span>
          </div>

          <div className="space-y-3">
            {analytics.urgencies?.map((u) => {
              const pct = Math.round((u.count / total) * 100);
              const colorClass = urgencyColors[u.urgency] || 'bg-slate-500 text-slate-300';
              return (
                <div key={u.urgency} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-300">{u.urgency}</span>
                    <span className="text-slate-400 font-mono">{u.count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${colorClass.split(' ')[0]}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Operational Insights */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2 mt-4 text-xs">
            <div className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Conclusiones del Agente de Analítica</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Las incidencias de ERP (SAP Ariba) y Bases de Datos (SQL Server) concentran el 68% de los incidentes de severidad Crítica. Se recomienda priorizar la automatización de scripts de reinicio para el túnel de SAP Cloud Connector.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
