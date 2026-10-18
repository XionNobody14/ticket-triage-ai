import React from 'react';
import { AlertTriangle, Clock, CheckCircle2, Bot } from 'lucide-react';

export default function KPICards({ analytics }) {
  if (!analytics) return null;

  const cards = [
    {
      title: 'Tickets Pendientes',
      value: (analytics.open_tickets || 0) + (analytics.in_progress_tickets || 0),
      subtitle: `${analytics.open_tickets || 0} Abiertos • ${analytics.in_progress_tickets || 0} En Proceso`,
      icon: Clock,
      iconColor: 'text-[#8F5700]',
      iconBg: 'bg-[#FFF3DD]',
      borderColor: 'border-[#FFF3DD]/60',
    },
    {
      title: 'Incidentes Críticos',
      value: analytics.critical_tickets || 0,
      subtitle: 'SLA Prioritario: < 2 Horas',
      icon: AlertTriangle,
      iconColor: 'text-[#7C3627]',
      iconBg: 'bg-[#FDE2DB]',
      borderColor: 'border-[#FDE2DB]/60',
    },
    {
      title: 'Automatización IA',
      value: `${analytics.automated_triage_rate || 98.2}%`,
      subtitle: `Confianza media: ${Math.round((analytics.avg_confidence_score || 0.88) * 100)}%`,
      icon: Bot,
      iconColor: 'text-[#503E70]',
      iconBg: 'bg-[#EDE6FA]',
      borderColor: 'border-[#EDE6FA]/60',
    },
    {
      title: 'Tiempo Ahorrado',
      value: `${analytics.estimated_hours_saved || 0} hrs`,
      subtitle: `${analytics.resolved_tickets || 0} incidencias resueltas`,
      icon: CheckCircle2,
      iconColor: 'text-[#2A5A3B]',
      iconBg: 'bg-[#DCF3E4]',
      borderColor: 'border-[#DCF3E4]/60',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="glass-card p-4 rounded-2xl border border-white/70 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-[#6C6677] uppercase tracking-wide">
                {card.title}
              </span>
              <div className={`w-8 h-8 rounded-xl ${card.iconBg} flex items-center justify-center ${card.iconColor} shadow-xs`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#2E2A36] tracking-tight mb-1">
                {card.value}
              </div>
              <div className="text-[11px] text-[#958FA3] font-medium">{card.subtitle}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
