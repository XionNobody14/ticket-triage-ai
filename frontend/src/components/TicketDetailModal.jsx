import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  User,
  Clock,
  Shield,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Check,
  Edit3,
  Save,
  MessageSquare,
  BookOpen,
  ArrowRight
} from 'lucide-react';

export default function TicketDetailModal({ ticket, onClose, onSave, onResolve }) {
  if (!ticket) return null;

  const [solutionText, setSolutionText] = useState(ticket.suggested_solution || '');
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket.status);
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSolutionText(ticket.suggested_solution || '');
    setCurrentStatus(ticket.status);
  }, [ticket]);

  const handleCopy = () => {
    navigator.clipboard.writeText(solutionText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveSolution = async () => {
    setIsSaving(true);
    try {
      await onSave(ticket.id, {
        suggested_solution: solutionText,
        status: currentStatus,
        comment: newComment ? `Nota del analista: ${newComment}` : undefined,
      });
      setIsEditingSolution(false);
      setNewComment('');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMarkResolved = async () => {
    setIsSaving(true);
    try {
      await onResolve(ticket.id, solutionText);
      setCurrentStatus('Resuelto');
    } finally {
      setIsSaving(false);
    }
  };

  const urgencyColors = {
    'Crítica': 'text-rose-400 bg-rose-500/10 border-rose-500/30',
    'Alta': 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    'Media': 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    'Baja': 'text-slate-400 bg-slate-500/10 border-slate-500/30',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-semibold text-slate-400 px-2 py-0.5 rounded bg-slate-800 border border-slate-700">
                Ticket #{ticket.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${urgencyColors[ticket.urgency]}`}>
                {ticket.urgency}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {ticket.category}
              </span>
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" /> SLA: {ticket.sla_hours || 24}h
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              {ticket.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-300">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Usuario Afectado</div>
              <div className="text-slate-200 font-medium truncate mt-0.5">{ticket.user_email || 'Sin correo registrado'}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Equipo Responsable</div>
              <div className="text-indigo-300 font-medium mt-0.5">{ticket.assigned_team || 'L1-Helpdesk'}</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-medium">Estado del Ticket</div>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="Abierto">Abierto</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Descripción de la Incidencia
            </h3>
            <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </div>
          </div>

          {/* AI Analysis & Knowledge Base Match */}
          <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
                <Sparkles className="w-4 h-4" />
                <span>Diagnóstico del Pipeline Agéntico de IA</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-slate-400">Nivel de Confianza:</span>
                <span className="px-2 py-0.5 rounded font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {Math.round((ticket.confidence_score || 0.85) * 100)}%
                </span>
              </div>
            </div>

            {ticket.matched_kb_id && (
              <div className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/60 p-2.5 rounded-lg border border-indigo-500/20">
                <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Procedimiento Estándar Vinculado:</span>
                <span className="font-mono text-indigo-300 font-semibold">[{ticket.matched_kb_id}]</span>
              </div>
            )}
          </div>

          {/* Suggested Solution & Editor */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-200">
                  Propuesta de Solución Técnica
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setIsEditingSolution(!isEditingSolution)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs transition-colors cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{isEditingSolution ? 'Modo Vista' : 'Editar Solución'}</span>
                </button>
              </div>
            </div>

            {isEditingSolution ? (
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows={10}
                className="w-full p-4 rounded-xl bg-slate-950 border border-indigo-500/50 text-slate-200 font-mono text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 leading-relaxed"
                placeholder="Redacta o ajusta los pasos de resolución..."
              />
            ) : (
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 font-mono text-slate-200 text-xs leading-relaxed whitespace-pre-wrap">
                {solutionText || 'No hay propuesta de solución redactada aún.'}
              </div>
            )}
          </div>

          {/* Add Internal Comment */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Agregar Nota Interna de Auditoría</span>
            </h3>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ej: Se comprobó que el túnel RFC ya fue reiniciado..."
              className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Audit Timeline */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Historial de Auditoría & Trazabilidad
            </h3>
            <div className="space-y-2.5">
              {ticket.audit_logs && ticket.audit_logs.length > 0 ? (
                ticket.audit_logs.map((log, index) => (
                  <div
                    key={log.id || index}
                    className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-start gap-3"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-300">{log.author}</span>
                        <span className="text-slate-400 font-mono">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Reciente'}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium text-indigo-400">{log.action}</div>
                      <p className="text-slate-400 text-xs">{log.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-slate-400 text-xs italic">Sin registros de auditoría aún.</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            Cerrar Ventana
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSaveSolution}
              disabled={isSaving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Guardar Cambios</span>
            </button>

            {currentStatus !== 'Resuelto' && (
              <button
                onClick={handleMarkResolved}
                disabled={isSaving}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-colors shadow-sm cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Marcar como Resuelto</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
