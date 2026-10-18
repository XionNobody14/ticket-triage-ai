const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : 'http://localhost:8000';

// Helper resiliente para resolver endpoints asegurando el prefijo /api
const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (API_BASE.endsWith('/api')) {
    return `${API_BASE}${cleanEndpoint.replace(/^\/api/, '')}`;
  }
  return cleanEndpoint.startsWith('/api') ? `${API_BASE}${cleanEndpoint}` : `${API_BASE}/api${cleanEndpoint}`;
};

export { API_BASE };

export async function fetchHealth() {
  try {
    const res = await fetch(getApiUrl('/health'));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Health Check] Error conectando a ${API_BASE}:`, err);
    throw err;
  }
}

export async function fetchTickets(params = {}) {
  console.log(`Conectando a: ${API_BASE}`);
  try {
    const query = new URLSearchParams();
    if (params.urgency && params.urgency !== 'Todas') query.append('urgency', params.urgency);
    if (params.status && params.status !== 'Todos') query.append('status', params.status);
    if (params.category && params.category !== 'Todas') query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(getApiUrl(`/tickets${queryString}`));
    if (!res.ok) throw new Error(`Error HTTP ${res.status} al obtener tickets`);
    return await res.json();
  } catch (err) {
    console.error(`[API Network Error] Fallo al conectar con ${API_BASE}:`, err);
    throw err;
  }
}

export async function fetchTicket(id) {
  try {
    const res = await fetch(getApiUrl(`/tickets/${id}`));
    if (!res.ok) throw new Error(`Error al obtener ticket #${id}: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al obtener ticket #${id}:`, err);
    throw err;
  }
}

export async function createTicket(ticketData) {
  try {
    const res = await fetch(getApiUrl('/tickets'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData),
    });
    if (!res.ok) throw new Error(`Error al crear ticket: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al crear ticket:`, err);
    throw err;
  }
}

export async function updateTicket(id, updateData) {
  try {
    const res = await fetch(getApiUrl(`/tickets/${id}`), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    });
    if (!res.ok) throw new Error(`Error al actualizar ticket #${id}: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al actualizar ticket #${id}:`, err);
    throw err;
  }
}

export async function executeTriage(triageData) {
  try {
    const res = await fetch(getApiUrl('/triage'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(triageData),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      throw new Error(errorBody.detail || `Error al ejecutar triaje agéntico: HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al ejecutar triaje agéntico:`, err);
    throw err;
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(getApiUrl('/analytics'));
    if (!res.ok) throw new Error(`Error al obtener analítica: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al obtener analítica de operaciones:`, err);
    throw err;
  }
}

export async function fetchKnowledge(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'Todas') query.append('category', params.category);
    if (params.search) query.append('search', params.search);

    const queryString = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(getApiUrl(`/knowledge${queryString}`));
    if (!res.ok) throw new Error(`Error al obtener base de conocimiento: HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al obtener base de conocimiento:`, err);
    throw err;
  }
}
