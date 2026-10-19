const API_BASE = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : 'http://localhost:8000';

// Helper resiliente para resolver endpoints asegurando el prefijo /api
const getApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  if (API_BASE.endsWith('/api')) {
    return `${API_BASE}${cleanEndpoint.replace(/^\/api/, '')}`;
  }
  return cleanEndpoint.startsWith('/api') ? `${API_BASE}${cleanEndpoint}` : `${API_BASE}/api${cleanEndpoint}`;
};

// Generador de cabeceras automáticas con inyección de X-Demo-Key y Token JWT de sesión
const getAuthHeaders = (extraHeaders = {}) => {
  const demoKey = typeof window !== 'undefined' ? (sessionStorage.getItem('demo_key') || '') : '';
  const authToken = typeof window !== 'undefined' ? (sessionStorage.getItem('auth_token') || localStorage.getItem('auth_token') || '') : '';
  const headers = {
    'X-Demo-Key': demoKey,
    ...extraHeaders,
  };
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
    headers['X-User-Token'] = authToken;
  }
  return headers;
};

export { API_BASE, getAuthHeaders };

export async function fetchHealth() {
  try {
    const res = await fetch(getApiUrl('/health'), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Health Check] Error conectando a ${API_BASE}:`, err);
    throw err;
  }
}

export async function loginUser(credentials) {
  try {
    const res = await fetch(getApiUrl('/auth/login'), {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(credentials),
    });
    if (res.status === 401) {
      const errorBody = await res.json().catch(() => ({}));
      const err = new Error(errorBody.detail || 'Credenciales inválidas. Verifica tu correo y contraseña.');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const err = new Error(errorBody.detail || `Error HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error('[API Auth] Error en inicio de sesión:', err);
    throw err;
  }
}

export async function fetchCurrentUser() {
  try {
    const res = await fetch(getApiUrl('/auth/me'), {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const err = new Error(`HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error('[API Auth] Error al obtener usuario actual:', err);
    throw err;
  }
}

export async function fetchUsers() {
  try {
    const res = await fetch(getApiUrl('/users'), {
      headers: getAuthHeaders(),
    });
    if (res.status === 401 || res.status === 403) {
      const err = new Error('No autorizado para ver lista de usuarios corporativos.');
      err.status = res.status;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error HTTP ${res.status} al listar usuarios`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error('[API Users] Error al listar usuarios:', err);
    throw err;
  }
}

export async function createUser(userData) {
  try {
    const res = await fetch(getApiUrl('/users'), {
      method: 'POST',
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(userData),
    });
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const err = new Error(errorBody.detail || `Error al crear usuario: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error('[API Users] Error al crear usuario:', err);
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
    const res = await fetch(getApiUrl(`/tickets${queryString}`), {
      headers: getAuthHeaders(),
    });

    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }

    if (!res.ok) {
      const err = new Error(`Error HTTP ${res.status} al obtener tickets`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Network Error] Fallo al conectar con ${API_BASE}:`, err);
    throw err;
  }
}

export async function fetchTicket(id) {
  try {
    const res = await fetch(getApiUrl(`/tickets/${id}`), {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error al obtener ticket #${id}: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(ticketData),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error al crear ticket: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(updateData),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error al actualizar ticket #${id}: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
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
      headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(triageData),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const errorBody = await res.json().catch(() => ({}));
      const err = new Error(errorBody.detail || `Error al ejecutar triaje agéntico: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al ejecutar triaje agéntico:`, err);
    throw err;
  }
}

export async function fetchAnalytics() {
  try {
    const res = await fetch(getApiUrl('/analytics'), {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error al obtener analítica: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
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
    const res = await fetch(getApiUrl(`/knowledge${queryString}`), {
      headers: getAuthHeaders(),
    });
    if (res.status === 401) {
      const err = new Error('UNAUTHORIZED');
      err.status = 401;
      throw err;
    }
    if (!res.ok) {
      const err = new Error(`Error al obtener base de conocimiento: HTTP ${res.status}`);
      err.status = res.status;
      throw err;
    }
    return await res.json();
  } catch (err) {
    console.error(`[API Error] Error al obtener base de conocimiento:`, err);
    throw err;
  }
}
