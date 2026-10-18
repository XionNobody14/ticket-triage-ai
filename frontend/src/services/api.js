const API_BASE = '/api';

export async function fetchHealth() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Error al conectar con la API');
  return res.json();
}

export async function fetchTickets(params = {}) {
  const query = new URLSearchParams();
  if (params.urgency && params.urgency !== 'Todas') query.append('urgency', params.urgency);
  if (params.status && params.status !== 'Todos') query.append('status', params.status);
  if (params.category && params.category !== 'Todas') query.append('category', params.category);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/tickets?${query.toString()}`);
  if (!res.ok) throw new Error('Error al obtener tickets');
  return res.json();
}

export async function fetchTicket(id) {
  const res = await fetch(`${API_BASE}/tickets/${id}`);
  if (!res.ok) throw new Error(`Error al obtener ticket #${id}`);
  return res.json();
}

export async function createTicket(ticketData) {
  const res = await fetch(`${API_BASE}/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(ticketData),
  });
  if (!res.ok) throw new Error('Error al crear ticket');
  return res.json();
}

export async function updateTicket(id, updateData) {
  const res = await fetch(`${API_BASE}/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateData),
  });
  if (!res.ok) throw new Error(`Error al actualizar ticket #${id}`);
  return res.json();
}

export async function executeTriage(triageData) {
  const res = await fetch(`${API_BASE}/triage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(triageData),
  });
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.detail || 'Error al ejecutar triaje agéntico');
  }
  return res.json();
}

export async function fetchAnalytics() {
  const res = await fetch(`${API_BASE}/analytics`);
  if (!res.ok) throw new Error('Error al obtener analítica de operaciones');
  return res.json();
}

export async function fetchKnowledge(params = {}) {
  const query = new URLSearchParams();
  if (params.category && params.category !== 'Todas') query.append('category', params.category);
  if (params.search) query.append('search', params.search);

  const res = await fetch(`${API_BASE}/knowledge?${query.toString()}`);
  if (!res.ok) throw new Error('Error al obtener base de conocimiento');
  return res.json();
}
