import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Shield,
  Layers,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { fetchKnowledge } from '../services/api';

export default function KnowledgeBaseView() {
  const [articles, setArticles] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [expandedId, setExpandedId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const data = await fetchKnowledge({
        category: selectedCategory,
        search: searchTerm
      });
      setArticles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header and Search Filters */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-400" />
            <span>Procedimientos Operativos Estándar (SOPs)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Artículos canónicos indexados por el agente de triaje para la resolución guiada
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en SOPs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg transition-colors cursor-pointer"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Articles Grid / List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-slate-400">
          Cargando base de conocimiento...
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center text-xs text-slate-400 bg-slate-900/40 border border-slate-800 rounded-2xl">
          No se encontraron procedimientos coincidentes con los criterios de búsqueda.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((art) => {
            const isExpanded = expandedId === art.id;
            return (
              <div
                key={art.id}
                className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden transition-all shadow-sm"
              >
                <div
                  onClick={() => toggleExpand(art.id)}
                  className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                      {art.id}
                    </span>
                    <div>
                      <h3 className="text-xs font-semibold text-slate-200 hover:text-indigo-300 transition-colors">
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[10px] text-slate-400 font-medium">
                          {art.category}
                        </span>
                        <span className="text-slate-400">•</span>
                        <span className="text-[10px] text-indigo-400 font-mono">
                          Equipo: {art.escalation_team}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Ocultar' : 'Ver Procedimiento'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-slate-800/80 bg-slate-950/60 space-y-4 text-xs">
                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Patrón o Síntoma Detectado
                      </h4>
                      <p className="text-slate-300 leading-relaxed bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                        {art.problem_pattern}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                        Procedimiento de Resolución Paso a Paso
                      </h4>
                      <div className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 font-mono text-[11px] text-slate-200 whitespace-pre-wrap leading-relaxed">
                        {art.solution_steps}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-2">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px] text-slate-400 font-medium">Palabras clave:</span>
                      {art.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
