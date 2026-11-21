/**
 * Configuración del frontend
 * 
 * Para desarrollo local: http://localhost:3000
 * Para producción (Render): reemplazar por la URL de tu backend desplegado
 * Ejemplo: https://palacio-del-morfi-api.onrender.com
 */
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://TU-BACKEND-EN-RENDER.onrender.com/api';

// Helper para formatear precios en ARS
function formatPrecio(n) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n);
}

// Helper para formatear hora
function formatHora(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
}

// Toast notifications
function showToast(message, type = 'success') {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transition = 'opacity 0.3s';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Fetch helper con manejo de errores
async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Error ${res.status}`);
    }
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
