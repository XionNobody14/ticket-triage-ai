import React, { useState, useEffect } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  Edit3,
  Save,
  MessageSquare,
  BookOpen
} from 'lucide-react';

export default function TicketDetailModal({ ticket, onClose, onSave, onResolve }) {
  const [solutionText, setSolutionText] = useState(ticket?.suggested_solution || '');
  const [isEditingSolution, setIsEditingSolution] = useState(false);
  const [copied, setCopied] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(ticket?.status || 'Abierto');
  const [newComment, setNewComment] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (ticket) {
      setSolutionText(ticket.suggested_solution || '');
      setCurrentStatus(ticket.status);
    }
  }, [ticket]);

  if (!ticket) return null;

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
    'Crítica': 'bg-[#FDE2DB] text-[#7C3627] border-[#7C3627]/20',
    'Alta': 'bg-[#FDE2DB] text-[#7C3627] border-[#7C3627]/20',
    'Media': 'bg-[#EDE6FA] text-[#503E70] border-[#503E70]/20',
    'Baja': 'bg-[#DCF3E4] text-[#2A5A3B] border-[#2A5A3B]/20',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2E2A36]/35 backdrop-blur-sm overflow-y-auto transition-opacity duration-300">
      {/* Modal / Bottom Sheet Container */}
      <div className="glass-modal w-full sm:max-w-4xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/60 bg-white/40 flex items-start justify-between gap-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#503E70] px-2.5 py-0.5 rounded-lg bg-white/80 border border-white">
                Ticket #{ticket.id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${urgencyColors[ticket.urgency]}`}>
                {ticket.urgency}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/15">
                {ticket.category}
              </span>
              <span className="text-xs text-[#6C6677] flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-[#958FA3]" /> SLA: {ticket.sla_hours || 24}h
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[#2E2A36] tracking-tight leading-snug">
              {ticket.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-[#6C6677] hover:text-[#2E2A36] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shadow-xs shrink-0"
            aria-label="Cerrar detalle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 text-xs text-[#2E2A36]">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-white/50 border border-white/80 shadow-xs">
            <div>
              <div className="text-[11px] text-[#6C6677] font-semibold uppercase tracking-wide">Usuario Afectado</div>
              <div className="text-[#2E2A36] font-medium truncate mt-0.5">{ticket.user_email || 'Sin correo registrado'}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#6C6677] font-semibold uppercase tracking-wide">Equipo Responsable</div>
              <div className="text-[#503E70] font-semibold mt-0.5">{ticket.assigned_team || 'L1-Helpdesk'}</div>
            </div>
            <div>
              <div className="text-[11px] text-[#6C6677] font-semibold uppercase tracking-wide">Estado del Ticket</div>
              <select
                value={currentStatus}
                onChange={(e) => setCurrentStatus(e.target.value)}
                className="mt-1 glass-input px-2.5 py-1 text-xs font-bold text-[#2E2A36] cursor-pointer w-full sm:w-auto"
              >
                <option value="Abierto">Abierto</option>
                <option value="En Proceso">En Proceso</option>
                <option value="Resuelto">Resuelto</option>
              </select>
            </div>
          </div>

          {/* Description Section */}
          <div className="space-y-1.5">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6C6677]">
              Descripción de la Incidencia
            </h3>
            <div className="p-4 rounded-2xl bg-white/50 border border-white/80 text-[#2E2A36] text-xs leading-relaxed whitespace-pre-wrap shadow-2xs">
              {ticket.description}
            </div>
          </div>

          {/* AI Analysis & Knowledge Base Match */}
          <div className="p-4 rounded-2xl bg-[#EDE6FA]/50 border border-[#EDE6FA] space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#503E70] font-bold text-xs">
                <Sparkles className="w-4 h-4 text-[#8E7EB8]" />
                <span>Diagnóstico del Pipeline Agéntico de IA</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#6C6677]">Confianza:</span>
                <span className="px-2 py-0.5 rounded-full font-mono font-bold bg-[#DCF3E4] text-[#2A5A3B] border border-[#2A5A3B]/15">
                  {Math.round((ticket.confidence_score || 0.85) * 100)}%
                </span>
              </div>
            </div>

            {ticket.matched_kb_id && (
              <div className="flex items-center gap-2 text-xs text-[#2E2A36] bg-white/70 p-2.5 rounded-xl border border-white shadow-2xs">
                <BookOpen className="w-4 h-4 text-[#8E7EB8] shrink-0" />
                <span className="text-[#6C6677]">Procedimiento Estándar Vinculado:</span>
                <span className="font-mono text-[#503E70] font-bold">[{ticket.matched_kb_id}]</span>
              </div>
            )}
          </div>

          {/* Suggested Solution & Editor */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-[#2A5A3B]" />
                <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#2E2A36]">
                  Propuesta de Solución Técnica
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-btn-secondary text-xs transition-colors cursor-pointer min-h-[36px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-[#2A5A3B]" /> : <Copy className="w-3.5 h-3.5 text-[#6C6677]" />}
                  <span>{copied ? 'Copiado' : 'Copiar'}</span>
                </button>
                <button
                  onClick={() => setIsEditingSolution(!isEditingSolution)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl glass-btn-secondary text-xs transition-colors cursor-pointer min-h-[36px]"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#7663A4]" />
                  <span>{isEditingSolution ? 'Modo Vista' : 'Editar'}</span>
                </button>
              </div>
            </div>

            {isEditingSolution ? (
              <textarea
                value={solutionText}
                onChange={(e) => setSolutionText(e.target.value)}
                rows={9}
                className="w-full p-4 rounded-2xl glass-input font-mono text-xs leading-relaxed focus:outline-none"
                placeholder="Ajusta o complementa los pasos de resolución..."
              />
            ) : (
              <div className="p-4 rounded-2xl bg-white/60 border border-white/80 font-mono text-[#2E2A36] text-xs leading-relaxed whitespace-pre-wrap shadow-2xs">
                {solutionText || 'No hay propuesta de solución redactada aún.'}
              </div>
            )}
          </div>

          {/* Add Internal Comment */}
          <div className="space-y-2 pt-2 border-t border-white/60">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6C6677] flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Agregar Nota Interna de Auditoría</span>
            </h3>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Ej: Se comprobó que el túnel RFC ya fue reiniciado..."
              className="w-full p-3 rounded-xl glass-input text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none min-h-[44px]"
            />
          </div>

          {/* Audit Timeline */}
          <div className="space-y-3 pt-2 border-t border-white/60">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-[#6C6677]">
              Historial de Auditoría & Trazabilidad
            </h3>
            <div className="space-y-2">
              {ticket.audit_logs && ticket.audit_logs.length > 0 ? (
                ticket.audit_logs.map((log, index) => (
                  <div
                    key={log.id || index}
                    className="p-3 rounded-xl bg-white/50 border border-white/80 flex items-start gap-3 shadow-2xs"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-[#8E7EB8] mt-1.5 shrink-0" />
                    <div className="flex-1 space-y-0.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#2E2A36]">{log.author}</span>
                        <span className="text-[#958FA3] font-mono">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Reciente'}
                        </span>
                      </div>
                      <div className="text-[11px] font-semibold text-[#503E70]">{log.action}</div>
                      <p className="text-[#6C6677] text-xs">{log.details}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-[#958FA3] text-xs italic">Sin registros de auditoría aún.</div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-white/60 bg-white/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl glass-btn-secondary text-xs font-semibold cursor-pointer min-h-[44px] flex items-center justify-center order-2 sm:order-1"
          >
            Cerrar
          </button>

          <div className="flex items-center gap-2.5 order-1 sm:order-2">
            <button
              onClick={handleSaveSolution}
              disabled={isSaving}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl glass-btn-secondary text-xs font-semibold cursor-pointer disabled:opacity-50 min-h-[44px]"
            >
              <Save className="w-3.5 h-3.5 text-[#7663A4]" />
              <span>Guardar</span>
            </button>

            {currentStatus !== 'Resuelto' && (
              <button
                onClick={handleMarkResolved}
                disabled={isSaving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#2A5A3B] to-[#3B7A50] text-white text-xs font-semibold transition-all shadow-md shadow-[#2A5A3B]/20 cursor-pointer disabled:opacity-50 min-h-[44px]"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Resolver Ticket</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
