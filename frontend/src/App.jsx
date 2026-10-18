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
  Sparkles
} from 'lucide-react';
import {
  fetchTickets,
  fetchTicket,
  updateTicket,
  fetchAnalytics,
  fetchHealth
} from './services/api';

export default function App() {
  const [currentView, setCurrentView] = useState('tickets'); // 'tickets' | 'analytics' | 'knowledge'
  const [tickets, setTickets] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isTriageOpen, setIsTriageOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isHealthy, setIsHealthy] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [ticketsData, analyticsData, healthData] = await Promise.all([
        fetchTickets({
          urgency: selectedUrgency,
          status: selectedStatus,
          category: selectedCategory,
          search: searchTerm,
        }),
        fetchAnalytics(),
        fetchHealth().catch(() => ({ status: 'error' }))
      ]);

      setTickets(ticketsData);
      setAnalytics(analyticsData);
      setIsHealthy(healthData.status === 'healthy');
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setIsHealthy(false);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedUrgency, selectedStatus, selectedCategory, searchTerm]);

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
