import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import KPICards from './components/KPICards';
import TicketList from './components/TicketList';
import TicketDetailModal from './components/TicketDetailModal';
import TriageModal from './components/TriageModal';
import AnalyticsView from './components/AnalyticsView';
import KnowledgeBaseView from './components/KnowledgeBaseView';
import {
  Inbox,
  BarChart3,
  BookOpen,
  Sparkles,
  Lock,
  KeyRound,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import {
  fetchTickets,
  fetchTicket,
  updateTicket,
  fetchAnalytics,
  fetchHealth,
  API_BASE
} from './services/api';

// Pantalla de acceso restringido bajo estética Neu-Natural Glass
function RestrictedAccessScreen({ onAuthenticate, errorReason }) {
  const [inputKey, setInputKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputKey.trim()) {
      onAuthenticate(inputKey.trim());
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      {/* Background ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#9B8DC4]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#86A892]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="glass-card max-w-md w-full p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/80 relative z-10 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#EDE6FA] to-[#DCF3E4] border border-white/80 flex items-center justify-center mx-auto shadow-xs text-[#503E70]">
          <Lock className="w-8 h-8" />
        </div>

        <div className="mt-5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/20">
            <KeyRound className="w-3.5 h-3.5" /> Acceso Restringido
          </span>
          <h1 className="text-xl sm:text-2xl font-bold text-[#2E2A36] tracking-tight mt-3">
            Plataforma en Modo Demostración Privada
          </h1>
          <p className="text-sm font-medium text-[#6C6677] mt-2">
            Acceso restringido para entrevistas técnicas.
          </p>
          <p className="text-xs text-[#6C6677]/80 mt-3 leading-relaxed">
            Esta instancia opera bajo entorno cerrado. Introduce tu clave de acceso autorizada para continuar:
          </p>
        </div>

        {errorReason && (
          <div className="mt-4 p-3 rounded-xl bg-[#FDE2DB] border border-[#F6C5B8] text-[#7C3627] text-xs font-semibold flex items-center gap-2 text-left">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorReason}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-3.5">
          <div className="relative">
            <input
              type="password"
              placeholder="Ingresa la clave de acceso..."
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              className="glass-input w-full px-4 py-3 text-sm text-[#2E2A36] placeholder-[#6C6677]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#8E7EB8]/40 border border-white/70"
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={!inputKey.trim()}
            className="w-full py-3 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#8E7EB8] to-[#503E70] hover:opacity-95 transition-all shadow-md hover:shadow-lg disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Desbloquear Consola</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-white/50 text-[11px] text-[#6C6677]/70 font-mono">
          Ticket Triage AI • Production Environment
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [currentView, setCurrentView] = useState('tickets'); // 'tickets' | 'analytics' | 'knowledge'
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthy, setIsHealthy] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    const keyFromUrl = params.get('key') || params.get('access_token');
    if (keyFromUrl) {
      sessionStorage.setItem('demo_key', keyFromUrl);
      window.history.replaceState({}, document.title, window.location.pathname);
      return true;
    }
    return Boolean(sessionStorage.getItem('demo_key'));
  });
  const [authError, setAuthError] = useState(null);

  // Filters
  const [selectedUrgency, setSelectedUrgency] = useState('Todas');
  const [selectedStatus, setSelectedStatus] = useState('Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleAuthenticate = (key) => {
    sessionStorage.setItem('demo_key', key);
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const loadData = async () => {
    // Si no hay clave en sesión, marcar como no autenticado
    const currentKey = sessionStorage.getItem('demo_key');
    if (!currentKey) {
      setIsAuthenticated(false);
      return;
    }

    setIsRefreshing(true);
    try {
      console.log(`Conectando a: ${API_BASE}`);
      const [ticketsData, analyticsData, healthData] = await Promise.all([
        fetchTickets({
          urgency: selectedUrgency,
          status: selectedStatus,
          category: selectedCategory,
          search: searchTerm,
        }),
        fetchAnalytics().catch((err) => {
          if (err.status === 401) throw err;
          console.warn('[Analytics] No se pudo cargar analítica:', err);
          return null;
        }),
        fetchHealth().catch(() => ({ status: 'error' }))
      ]);

      setTickets(ticketsData || []);
      if (analyticsData) setAnalytics(analyticsData);
      setIsHealthy(healthData.status === 'healthy');
      setIsAuthenticated(true);
      setAuthError(null);
    } catch (err) {
      if (err.status === 401 || err.message === 'UNAUTHORIZED') {
        console.warn('Acceso denegado (401 Unauthorized). Bloqueando pantalla.');
        setIsAuthenticated(false);
        setAuthError('La clave de acceso ingresada es inválida o expiró.');
      } else {
        console.error('Error al cargar datos en consola de soporte:', err);
        setIsHealthy(false);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Revisar si existe clave al montar o cambiar filtros
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, selectedUrgency, selectedStatus, selectedCategory, searchTerm]);

  // Extract distinct categories from analytics
  const categories = analytics?.categories?.map((c) => c.category) || [
    'ERP & Finanzas',
    'Firma Digital & LegalTech',
    'Bases de Datos & SQL',
    'Identidad & Accesos (IAM)',
    'Infraestructura & Redes',
    'Seguridad & Accesos',
    'Productividad & Colaboración'
  ];

  const handleSelectTicket = async (ticketSummary) => {
    try {
      const fullTicket = await fetchTicket(ticketSummary.id);
      setSelectedTicket(fullTicket);
    } catch (err) {
      if (err.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      console.error(err);
      setSelectedTicket(ticketSummary);
    }
  };

  const handleUpdateStatus = async (ticketId, newStatus) => {
    try {
      const updated = await updateTicket(ticketId, { status: newStatus });
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      showToast(`Ticket #${ticketId} actualizado a estado "${newStatus}".`);
      loadData();
    } catch (err) {
      if (err.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      console.error(err);
    }
  };

  const handleSaveTicketDetail = async (ticketId, updateData) => {
    try {
      const updated = await updateTicket(ticketId, updateData);
      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      showToast(`Ticket #${ticketId} guardado exitosamente.`);
      loadData();
    } catch (err) {
      if (err.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      console.error(err);
    }
  };

  const handleResolveTicket = async (ticketId, solutionText) => {
    try {
      const updated = await updateTicket(ticketId, {
        status: 'Resuelto',
        suggested_solution: solutionText,
        comment: 'Incidencia resuelta mediante procedimiento guiado por IA.',
      });
      setSelectedTicket(updated);
      setTickets((prev) => prev.map((t) => (t.id === ticketId ? updated : t)));
      showToast(`Ticket #${ticketId} marcado como RESUELTO.`);
      loadData();
    } catch (err) {
      if (err.status === 401) {
        setIsAuthenticated(false);
        return;
      }
      console.error(err);
    }
  };

  const handleTicketCreated = (newTicket) => {
    if (newTicket) {
      setTickets((prev) => [newTicket, ...prev]);
      showToast(`Nuevo ticket #${newTicket.id} clasificado como "${newTicket.urgency}".`);
      loadData();
      handleSelectTicket(newTicket);
    }
  };

  // Si no está autenticado, renderizar pantalla limpia de acceso restringido
  if (!isAuthenticated) {
    return (
      <RestrictedAccessScreen
        onAuthenticate={handleAuthenticate}
        errorReason={authError}
      />
    );
  }

  const openTicketsCount = analytics?.open_tickets || 0;

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      {/* Sidebar: Persistent on Desktop, Slide-out Drawer on Mobile */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openTicketsCount={openTicketsCount}
        onOpenTriage={() => setIsTriageOpen(true)}
        isHealthy={isHealthy}
        mobileOpen={mobileMenuOpen}
        setMobileOpen={setMobileMenuOpen}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Header
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onRefresh={loadData}
          isRefreshing={isRefreshing}
          onOpenTriage={() => setIsTriageOpen(true)}
          currentView={currentView}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-24 md:pb-6">
          {currentView === 'tickets' && (
            <div className="space-y-5 max-w-7xl mx-auto">
              <KPICards analytics={analytics} />
              <TicketList
                tickets={tickets}
                selectedUrgency={selectedUrgency}
                setSelectedUrgency={setSelectedUrgency}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                onSelectTicket={handleSelectTicket}
                onUpdateStatus={handleUpdateStatus}
                categories={categories}
              />
            </div>
          )}

          {currentView === 'analytics' && (
            <div className="max-w-7xl mx-auto">
              <AnalyticsView analytics={analytics} />
            </div>
          )}

          {currentView === 'knowledge' && (
            <div className="max-w-7xl mx-auto">
              <KnowledgeBaseView />
            </div>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (<= 768px) with Touch Targets >= 44x44px */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 glass-panel border-t border-white/70 px-3 py-2 z-30 flex items-center justify-around shadow-lg">
        <button
          onClick={() => setCurrentView('tickets')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentView === 'tickets' ? 'text-[#503E70] font-bold bg-white/70' : 'text-[#6C6677]'
          }`}
        >
          <div className="relative">
            <Inbox className="w-5 h-5" />
            {openTicketsCount > 0 && (
              <span className="absolute -top-1.5 -right-2 w-4 h-4 rounded-full bg-[#EDE6FA] text-[#503E70] border border-[#503E70]/20 text-[9px] font-bold flex items-center justify-center font-mono">
                {openTicketsCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Tickets</span>
        </button>

        <button
          onClick={() => setCurrentView('analytics')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentView === 'analytics' ? 'text-[#503E70] font-bold bg-white/70' : 'text-[#6C6677]'
          }`}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Analítica</span>
        </button>

        <button
          onClick={() => setCurrentView('knowledge')}
          className={`flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 rounded-xl transition-all cursor-pointer ${
            currentView === 'knowledge' ? 'text-[#503E70] font-bold bg-white/70' : 'text-[#6C6677]'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Base SOP</span>
        </button>

        <button
          onClick={() => setIsTriageOpen(true)}
          className="flex flex-col items-center justify-center min-w-[48px] min-h-[44px] px-2 rounded-xl transition-all cursor-pointer text-[#7663A4]"
        >
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-[#9B8DC4] to-[#7663A4] flex items-center justify-center text-white shadow-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <span className="text-[10px] mt-0.5 font-bold">Simular</span>
        </button>
      </nav>

      {/* Modals */}
      {selectedTicket && (
        <TicketDetailModal
          ticket={selectedTicket}
          onClose={() => setSelectedTicket(null)}
          onSave={handleSaveTicketDetail}
          onResolve={handleResolveTicket}
        />
      )}

      {isTriageOpen && (
        <TriageModal
          onClose={() => setIsTriageOpen(false)}
          onTicketCreated={handleTicketCreated}
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-50 px-4 py-3 rounded-2xl glass-modal text-[#2E2A36] text-xs shadow-xl flex items-center gap-2.5 animate-in slide-in-from-bottom duration-200 border border-white">
          <div className="w-2.5 h-2.5 rounded-full bg-[#8E7EB8] animate-pulse" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
