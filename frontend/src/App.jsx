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

  const openTicketsCount = (analytics?.open_tickets || 0);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        setCurrentView={setCurrentView}
        openTicketsCount={openTicketsCount}
        onOpenTriage={() => setIsTriageOpen(true)}
        isHealthy={isHealthy}
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
        />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'tickets' && (
            <div className="space-y-6 max-w-7xl mx-auto">
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
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 border border-indigo-500/40 text-slate-100 text-xs shadow-2xl shadow-indigo-500/10 flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
