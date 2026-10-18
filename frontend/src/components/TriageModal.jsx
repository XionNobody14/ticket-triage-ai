import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Loader2,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { executeTriage } from '../services/api';

const PRESETS = [
  {
    name: 'SAP Ariba 503',
    title: 'Fallo crítico en SAP Ariba: Error 503 al aprobar órdenes de compra PO-2026-90',
    description: 'El personal de adquisiciones no puede emitir ni aprobar órdenes de compra con proveedores clave. El Cloud Connector muestra error 503 Service Unavailable y cola tRFC desbordada hacia el destino ARIBA_INTEGRATION_GATEWAY.',
    email: 'compras.planta@empresa.com'
  },
  {
    name: 'Doc2Sign Firma',
    title: 'Token expirado y certificado no reconocido en firma de contrato NDA en Doc2Sign',
    description: 'El Director Comercial y el cliente externo intentan firmar el acuerdo de confidencialidad NDA-2026-X pero el sistema arroja token inválido y error de certificado digital. El webhook hacia Salesforce no actualizó la oportunidad.',
    email: 'legal.director@empresa.com'
  },
  {
    name: 'SQL Deadlocks',
    title: 'Error 1045 Access Denied y múltiples deadlocks en clúster de Base de Datos Producción',
    description: 'La aplicación web de pagos no puede conectar con la base de datos MySQL por error 1045 Access Denied for user billing_prod. Adicionalmente se reportan deadlocks que bloquean la tabla de transacciones.',
    email: 'dba.support@empresa.com'
  },
  {
    name: 'Okta MFA Bloqueo',
    title: 'MFA bloqueado tras actualización de dispositivo móvil para Directora de Finanzas',
    description: 'La Directora de Finanzas no puede ingresar a su correo ni a la banca corporativa debido a que restableció su teléfono y perdió el autenticador Okta Verify. Requiere acceso antes del cierre de transferencias.',
    email: 'finanzas.vp@empresa.com'
  }
];

export default function TriageModal({ onClose, onTicketCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('usuario.solicitante@empresa.com');
  const [isLoading, setIsLoading] = useState(false);
  const [previewAnalysis, setPreviewAnalysis] = useState(null);
  const [error, setError] = useState(null);

  const applyPreset = (preset) => {
    setTitle(preset.title);
    setDescription(preset.description);
    setEmail(preset.email);
    setPreviewAnalysis(null);
    setError(null);
  };

  const handlePreviewTriage = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Por favor completa el título y la descripción de la incidencia.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await executeTriage({
        title,
        description,
        user_email: email,
        dry_run: true
      });
      setPreviewAnalysis(res.analysis);
    } catch (err) {
      setError(err.message || 'Error al analizar incidencia.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateTicket = async () => {
    if (!title.trim() || !description.trim()) {
      setError('Por favor completa el título y la descripción de la incidencia.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const res = await executeTriage({
        title,
        description,
        user_email: email,
        dry_run: false
      });
      onTicketCreated(res.ticket);
      onClose();
    } catch (err) {
      setError(err.message || 'Error al crear e ingresar ticket.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2E2A36]/35 backdrop-blur-sm overflow-y-auto transition-opacity duration-300">
      <div className="glass-modal w-full sm:max-w-3xl max-h-[92vh] sm:rounded-3xl rounded-t-3xl flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:slide-in-from-bottom-0 sm:fade-in duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/60 bg-white/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EDE6FA] flex items-center justify-center text-[#503E70] border border-[#503E70]/15 shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-[#2E2A36] tracking-tight">
                Simulador de Triaje Agéntico en Vivo
              </h2>
              <p className="text-[11px] text-[#6C6677]">
                Clasificación automática, severidad y generación de propuesta de resolución
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-white/70 hover:bg-white text-[#6C6677] hover:text-[#2E2A36] transition-colors cursor-pointer min-w-[44px] min-h-[44px] flex items-center justify-center shadow-xs"
            aria-label="Cerrar simulador"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-xs text-[#2E2A36]">
          {/* Quick Presets */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-bold text-[#6C6677] uppercase tracking-wider">
              Plantillas Rápidas (1-Click)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2.5 text-left rounded-xl glass-btn-secondary text-[11px] font-semibold text-[#503E70] cursor-pointer min-h-[44px] flex items-center justify-center"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-[#FDE2DB] border border-[#7C3627]/20 text-[#7C3627] text-xs flex items-center gap-2 shadow-2xs">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-bold text-[#6C6677] uppercase tracking-wider mb-1">
                Título de la Incidencia *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Fallo crítico en sincronización SAP Ariba ERP"
                className="w-full p-3 rounded-xl glass-input text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none min-h-[44px]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6C6677] uppercase tracking-wider mb-1">
                Descripción Detallada del Problema *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe los síntomas, códigos de error (502, 1045), sistemas involucrados y usuarios afectados..."
                className="w-full p-3 rounded-xl glass-input text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#6C6677] uppercase tracking-wider mb-1">
                Correo Electrónico del Solicitante
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-xl glass-input text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none min-h-[44px]"
              />
            </div>
          </div>

          {/* Live Preview of AI Analysis */}
          {previewAnalysis && (
            <div className="p-4 rounded-2xl bg-[#EDE6FA]/50 border border-[#EDE6FA] space-y-3 animate-in fade-in duration-150 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#503E70] flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Diagnóstico Predictivo de IA
                </span>
                <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#DCF3E4] text-[#2A5A3B] border border-[#2A5A3B]/15">
                  {Math.round(previewAnalysis.confidence_score * 100)}% Confianza
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-white/70 border border-white shadow-2xs">
                  <span className="text-[#6C6677] block text-[10px] uppercase font-bold">Categoría</span>
                  <span className="font-bold text-[#2E2A36]">{previewAnalysis.category}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-white shadow-2xs">
                  <span className="text-[#6C6677] block text-[10px] uppercase font-bold">Severidad</span>
                  <span className="font-bold text-[#7C3627]">{previewAnalysis.urgency}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/70 border border-white shadow-2xs col-span-2 sm:col-span-1">
                  <span className="text-[#6C6677] block text-[10px] uppercase font-bold">SLA Estimado</span>
                  <span className="font-bold text-[#8F5700]">{previewAnalysis.sla_hours} Horas</span>
                </div>
              </div>

              {previewAnalysis.matched_kb && (
                <div className="p-2.5 rounded-xl bg-white/70 border border-white flex items-center gap-2 text-xs shadow-2xs">
                  <BookOpen className="w-4 h-4 text-[#8E7EB8] shrink-0" />
                  <span className="text-[#6C6677]">SOP:</span>
                  <span className="font-mono text-[#503E70] font-bold truncate">
                    [{previewAnalysis.matched_kb.id}] {previewAnalysis.matched_kb.title}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#6C6677] uppercase">Borrador Generado:</span>
                <div className="p-3 rounded-xl bg-white/70 border border-white font-mono text-[11px] text-[#2E2A36] whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed shadow-2xs">
                  {previewAnalysis.suggested_solution}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/60 bg-white/60 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={handlePreviewTriage}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl glass-btn-secondary text-xs font-semibold cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-[#7663A4]" />}
            <span>Previsualizar Análisis de IA</span>
          </button>

          <button
            type="button"
            onClick={handleCreateTicket}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl glass-btn-primary text-xs font-semibold cursor-pointer disabled:opacity-50 min-h-[44px]"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ingresar y Clasificar Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
