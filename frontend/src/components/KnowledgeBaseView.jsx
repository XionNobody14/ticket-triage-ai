import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Tag,
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

  useEffect(() => {
    loadArticles();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadArticles();
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-5">
      {/* Header and Search Filters */}
      <div className="glass-panel rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#2E2A36] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#7663A4]" />
            <span>Procedimientos Operativos Estándar (SOPs)</span>
          </h2>
          <p className="text-xs text-[#6C6677] mt-0.5">
            Artículos canónicos indexados por el agente de triaje para la resolución guiada
          </p>
        </div>

        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#958FA3]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar en SOPs..."
              className="w-full glass-input pl-8 pr-3 py-2 text-xs text-[#2E2A36] placeholder:text-[#958FA3] focus:outline-none min-h-[44px]"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 glass-btn-primary text-xs font-semibold rounded-xl cursor-pointer min-h-[44px] flex items-center justify-center shadow-xs"
          >
            Buscar
          </button>
        </form>
      </div>

      {/* Articles Grid / List */}
      {isLoading ? (
        <div className="p-12 text-center text-xs text-[#6C6677] glass-panel rounded-3xl">
          Cargando base de conocimiento...
        </div>
      ) : articles.length === 0 ? (
        <div className="p-12 text-center text-xs text-[#6C6677] glass-panel rounded-3xl">
          No se encontraron procedimientos coincidentes con los criterios de búsqueda.
        </div>
      ) : (
        <div className="space-y-3">
          {articles.map((art) => {
            const isExpanded = expandedId === art.id;
            return (
              <div
                key={art.id}
                className="glass-card rounded-2xl overflow-hidden transition-all shadow-xs"
              >
                <div
                  onClick={() => toggleExpand(art.id)}
                  className="p-4 sm:p-5 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/70 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/20 shadow-2xs">
                      {art.id}
                    </span>
                    <div>
                      <h3 className="text-xs sm:text-sm font-bold text-[#2E2A36] group-hover:text-[#503E70] transition-colors">
                        {art.title}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="text-[11px] text-[#6C6677] font-medium">
                          {art.category}
                        </span>
                        <span className="text-[#958FA3]">•</span>
                        <span className="text-[11px] text-[#7663A4] font-semibold">
                          Equipo: {art.escalation_team}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#6C6677] font-semibold hidden sm:inline">
                      {isExpanded ? 'Ocultar' : 'Ver Procedimiento'}
                    </span>
                    <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center text-[#6C6677] border border-white shadow-2xs">
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-5 border-t border-white/60 bg-white/40 space-y-4 text-xs">
                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C6677] mb-1.5">
                        Patrón o Síntoma Detectado
                      </h4>
                      <p className="text-[#2E2A36] leading-relaxed bg-white/60 p-3.5 rounded-2xl border border-white shadow-2xs">
                        {art.problem_pattern}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#6C6677] mb-1.5">
                        Procedimiento de Resolución Paso a Paso
                      </h4>
                      <div className="p-4 rounded-2xl bg-white/70 border border-white font-mono text-[11px] text-[#2E2A36] whitespace-pre-wrap leading-relaxed shadow-2xs">
                        {art.solution_steps}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Tag className="w-3.5 h-3.5 text-[#958FA3]" />
                      <span className="text-[11px] text-[#6C6677] font-semibold">Palabras clave:</span>
                      {art.tags.split(',').map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-0.5 rounded-lg bg-white/80 text-[10px] font-mono font-medium text-[#503E70] border border-white shadow-2xs"
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
