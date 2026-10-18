import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Bot } from 'lucide-react';

export default function KPICards({ analytics }) {
  if (!analytics) return null;

  const cards = [
    {
      title: 'Tickets Pendientes',
      value: (analytics.open_tickets || 0) + (analytics.in_progress_tickets || 0),
      subtitle: `${analytics.open_tickets || 0} Abiertos / ${analytics.in_progress_tickets || 0} En Proceso`,
      icon: Clock,
      color: 'text-amber-400',
      bgGradient: 'from-amber-500/10 to-transparent',
      borderColor: 'border-amber-500/20',
    },
    {
      title: 'Incidentes Críticos',
      value: analytics.critical_tickets || 0,
      subtitle: 'SLA Prioritario: < 2 Horas',
      icon: AlertTriangle,
      color: 'text-rose-400',
      bgGradient: 'from-rose-500/10 to-transparent',
      borderColor: 'border-rose-500/20',
    },
    {
      title: 'Tasa Automatización IA',
      value: `${analytics.automated_triage_rate || 98.2}%`,
      subtitle: `Confianza media: ${Math.round((analytics.avg_confidence_score || 0.88) * 100)}%`,
      icon: Bot,
      color: 'text-indigo-400',
      bgGradient: 'from-indigo-500/10 to-transparent',
      borderColor: 'border-indigo-500/20',
    },
    {
      title: 'Tiempo Ahorrado Estimado',
      value: `${analytics.estimated_hours_saved || 0} hrs`,
      subtitle: `${analytics.resolved_tickets || 0} incidencias resueltas`,
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bgGradient: 'from-emerald-500/10 to-transparent',
      borderColor: 'border-emerald-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-4 rounded-xl bg-gradient-to-b ${card.bgGradient} bg-slate-900/60 border ${card.borderColor} backdrop-blur-sm shadow-sm relative overflow-hidden`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-400">{card.title}</span>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-100 tracking-tight mb-1">
              {card.value}
            </div>
            <div className="text-[11px] text-slate-400">{card.subtitle}</div>
          </div>
        );
      })}
    </div>
  );
}
