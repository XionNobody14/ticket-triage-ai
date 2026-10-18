import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Bot,
  Send,
  Loader2,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { executeTriage } from '../services/api';

const PRESETS = [
  {
    name: 'SAP Ariba 503 Gateway',
    title: 'Fallo crítico en SAP Ariba: Error 503 al aprobar órdenes de compra PO-2026-90',
    description: 'El personal de adquisiciones no puede emitir ni aprobar órdenes de compra con proveedores clave. El Cloud Connector muestra error 503 Service Unavailable y cola tRFC desbordada hacia el destino ARIBA_INTEGRATION_GATEWAY.',
    email: 'compras.planta@empresa.com'
  },
  {
    name: 'Doc2Sign Firma Bloqueada',
    title: 'Token expirado y certificado no reconocido en firma de contrato NDA en Doc2Sign',
    description: 'El Director Comercial y el cliente externo intentan firmar el acuerdo de confidencialidad NDA-2026-X pero el sistema arroja token inválido y error de certificado digital. El webhook hacia Salesforce no actualizó la oportunidad.',
    email: 'legal.director@empresa.com'
  },
  {
    name: 'SQL Access Denied & Deadlock',
    title: 'Error 1045 Access Denied y múltiples deadlocks en clúster de Base de Datos Producción',
    description: 'La aplicación web de pagos no puede conectar con la base de datos MySQL por error 1045 Access Denied for user billing_prod. Adicionalmente se reportan deadlocks que bloquean la tabla de transacciones.',
    email: 'dba.support@empresa.com'
  },
  {
    name: 'Okta MFA Bloqueado',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 tracking-tight">
                Simulador de Triaje Agéntico en Tiempo Real
              </h2>
              <p className="text-xs text-slate-400">
                Inferencia de categoría, severidad y generación de propuesta de resolución
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
          {/* Quick Presets */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Plantillas de Incidencias Corporativas (1-Click)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="p-2 text-left rounded-lg bg-slate-950/70 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800/50 transition-colors text-[11px] text-slate-300 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Título de la Incidencia *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Fallo crítico en sincronización SAP Ariba ERP"
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Descripción Detallada del Problema *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                placeholder="Describe el síntoma, códigos de error (502, 1045), sistemas involucrados y usuarios afectados..."
                className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Correo Electrónico del Solicitante
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Live Preview of AI Analysis */}
          {previewAnalysis && (
            <div className="p-4 rounded-xl bg-indigo-950/20 border border-indigo-500/30 space-y-3 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> Diagnóstico Predictivo de IA
                </span>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {Math.round(previewAnalysis.confidence_score * 100)}% Confianza
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Categoría</span>
                  <span className="font-semibold text-slate-200">{previewAnalysis.category}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                  <span className="text-slate-400 block text-[10px]">Urgencia / Severidad</span>
                  <span className="font-semibold text-rose-300">{previewAnalysis.urgency}</span>
                </div>
                <div className="p-2 rounded bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">SLA Estimado</span>
                  <span className="font-semibold text-amber-300">{previewAnalysis.sla_hours} Horas</span>
                </div>
              </div>

              {previewAnalysis.matched_kb && (
                <div className="p-2.5 rounded bg-slate-950/60 border border-indigo-500/20 flex items-center gap-2 text-xs">
                  <BookOpen className="w-4 h-4 text-indigo-400 shrink-0" />
                  <span className="text-slate-300">SOP Asociado:</span>
                  <span className="font-mono text-indigo-300 font-semibold truncate">
                    [{previewAnalysis.matched_kb.id}] {previewAnalysis.matched_kb.title}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-semibold text-slate-400">Borrador de Solución Generado:</span>
                <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {previewAnalysis.suggested_solution}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handlePreviewTriage}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-indigo-400" />}
            <span>Previsualizar Análisis de IA</span>
          </button>

          <button
            type="button"
            onClick={handleCreateTicket}
            disabled={isLoading}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors shadow-md shadow-indigo-600/20 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            <span>Ingresar y Clasificar Ticket</span>
          </button>
        </div>
      </div>
    </div>
  );
}
