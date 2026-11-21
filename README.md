# 🍽️ El Palacio del Morfi

**Sistema de Gestión Integral para Restaurante**

Proyecto Final Integrador – Técnico en Programación a Distancia

---

## 📋 Descripción

**El Palacio del Morfi** es un restaurante familiar que ofrece servicio de salón (13 mesas), take-away y delivery.  
Actualmente todos los procesos se gestionan de forma manual (papel y lapicera), lo que genera pérdida de comandas, errores de comunicación y falta de control.

Este sistema digitaliza los procesos clave:

| Módulo              | Descripción                                              |
|---------------------|----------------------------------------------------------|
| **Menú Digital**    | Visualización del menú del día con filtros por categoría |
| **Panel Mozo**      | Toma de pedidos desde el celular (salón / delivery / para llevar) |
| **Panel Cocina**    | Visualización de pedidos activos y cambio de estado      |
| **Control de Caja** | Resumen de ventas del día y listado de transacciones     |

---

## 👥 Equipo

| Integrante              | Rol          |
|-------------------------|--------------|
| Torres, Jorge David     | Desarrollo   |
| Iañez, Sol Ludmila      | Desarrollo   |
| Pighin, Bruno Joaquín   | Desarrollo   |

**Tutor:** (completar con el nombre del tutor asignado)

---

## 🧰 Stack Tecnológico

| Capa          | Tecnología                          | Justificación                                      |
|---------------|-------------------------------------|----------------------------------------------------|
| Frontend      | HTML5 + CSS3 + JavaScript Vanilla   | Simple, liviano, funciona en cualquier dispositivo |
| Backend       | Node.js + Express                   | Unifica lenguaje con el frontend, fácil de desplegar |
| Base de Datos | MongoDB Atlas + Mongoose            | Flexibilidad documental, alineado con la materia   |
| Despliegue    | Vercel (Frontend) + Render (Backend) + MongoDB Atlas | Capas gratuitas suficientes para el MVP |

---

## 📁 Estructura del Repositorio

```
palacio-del-morfi/
├── README.md
├── .gitignore
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── seed.js                 # Carga platos de ejemplo
│   ├── .env.example
│   ├── config/db.js
│   ├── models/                 # Plato, Pedido, Venta
│   ├── controllers/
│   └── routes/
├── frontend/
│   ├── index.html              # Menú Digital
│   ├── mozo.html               # Panel del Mozo
│   ├── cocina.html             # Panel de Cocina
│   ├── ventas.html             # Control de Caja
│   ├── css/styles.css
│   └── js/
├── database/
│   ├── esquema-mongodb.md      # Documentación del esquema
│   └── README.md
└── docs/
    ├── arquitectura.md
    └── modulos.md
```

---

## 🚀 Cómo probarlo en local

### Requisitos previos
- Node.js 18+ instalado ([nodejs.org](https://nodejs.org))
- Cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### 1. Clonar / descomprimir el proyecto

```bash
cd palacio-del-morfi
```

### 2. Configurar la base de datos (MongoDB Atlas)

1. Creá un cluster gratuito (M0).
2. En **Database Access** creá un usuario con contraseña.
3. En **Network Access** agregá `0.0.0.0/0` (permitir desde cualquier IP) o tu IP.
4. En **Database → Connect → Drivers** copiá la connection string.
5. Reemplazá `<password>` y el nombre de la base:

```
mongodb+srv://usuario:TU_PASSWORD@cluster0.xxxxx.mongodb.net/palacio_del_morfi?retryWrites=true&w=majority
```

### 3. Configurar el backend

```bash
cd backend
cp .env.example .env
```

Editá el archivo `.env` y pegá tu `MONGODB_URI`:

```env
PORT=3000
MONGODB_URI=mongodb+srv://usuario:password@cluster0.xxxxx.mongodb.net/palacio_del_morfi?retryWrites=true&w=majority
NODE_ENV=development
```

Instalá dependencias y cargá los platos de ejemplo:

```bash
npm install
npm run seed
```

Levantá el servidor:

```bash
npm start
```

Deberías ver:
```
✅ MongoDB conectado: ...
🚀 Servidor corriendo en puerto 3000
```

Probá: [http://localhost:3000](http://localhost:3000) → debería responder con un JSON de bienvenida.

### 4. Abrir el frontend

Abrí los archivos HTML directamente en el navegador **o** usá un servidor estático simple:

```bash
# Desde la raíz del proyecto
npx serve frontend
```

Luego entrá a:
- Menú Digital → la URL que te muestre `serve`
- Panel Mozo → `/mozo.html`
- Panel Cocina → `/cocina.html`
- Ventas → `/ventas.html`

> **Nota:** El frontend detecta automáticamente si está en `localhost` y apunta a `http://localhost:3000/api`.

### 5. Flujo de prueba recomendado

1. Abrí **Menú Digital** → verificá que se listen los platos.
2. Abrí **Panel Mozo** → agregá platos, elegí mesa y enviá el pedido.
3. Abrí **Panel Cocina** → debería aparecer el pedido. Cambiá el estado (Pendiente → En cocina → Listo → Entregado).
4. Abrí **Ventas** → verificá el resumen del día.

---

## ☁️ Despliegue en la nube

### Backend en Render

1. Subí el repositorio a GitHub.
2. En [Render](https://render.com) → **New → Web Service**.
3. Conectá el repo.
4. Configuración:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** agregá `MONGODB_URI` y `NODE_ENV=production`
5. Deploy. Anotá la URL (ej: `https://palacio-del-morfi-api.onrender.com`).

### Frontend en Vercel

1. En [Vercel](https://vercel.com) → **Add New Project**.
2. Importá el mismo repo.
3. Configuración:
   - **Root Directory:** `frontend`
   - Framework Preset: Other
4. Antes de desplegar, editá `frontend/js/config.js` y reemplazá la URL de producción:

```js
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:3000/api'
  : 'https://TU-BACKEND-EN-RENDER.onrender.com/api';  // ← acá
```

5. Deploy.

### Actualizar el README con los enlaces

Una vez desplegado, agregá en este README:

```
### Sistema desplegado
- Frontend: https://...
- Backend API: https://...
```

---

## 📡 Endpoints de la API

| Método | Ruta                        | Descripción                          |
|--------|-----------------------------|--------------------------------------|
| GET    | `/api/platos`               | Listar platos (filtros: categoria, disponible) |
| GET    | `/api/platos/:id`           | Obtener un plato                     |
| POST   | `/api/platos`               | Crear plato                          |
| PUT    | `/api/platos/:id`           | Actualizar plato                     |
| PATCH  | `/api/platos/:id/disponibilidad` | Toggle disponible              |
| GET    | `/api/pedidos`              | Listar pedidos                       |
| GET    | `/api/pedidos/activos`      | Pedidos pendientes / en cocina / listos |
| POST   | `/api/pedidos`              | Crear pedido (crea venta automática) |
| PATCH  | `/api/pedidos/:id/estado`   | Cambiar estado                       |
| GET    | `/api/ventas`               | Listar ventas                        |
| GET    | `/api/ventas/resumen`       | Resumen del día                      |

---

## 🗄️ Modelo de datos (resumen)

- **platos**: nombre, descripción, precio, categoría, disponible
- **pedidos**: items (embebidos), total, tipo, estado, mesa / datos delivery
- **ventas**: registro automático al crear un pedido (control de caja)

Documentación completa: [`database/esquema-mongodb.md`](./database/esquema-mongodb.md)

---

## 📐 Alcance del MVP implementado

### Incluido
- Menú digital con filtros
- Toma de pedidos (salón, para llevar, delivery)
- Panel de cocina con cambio de estados
- Registro automático de ventas + resumen del día
- Diseño responsive (celular / tablet)

### Fuera de alcance (evolución futura)
- Autenticación y roles
- Estadísticas avanzadas / reportes históricos
- Impresión de comandas
- Integración con WhatsApp / Mercado Pago
- Gestión de stock

---

## 📄 Documentación adicional

- [Arquitectura](./docs/arquitectura.md)
- [Listado de módulos](./docs/modulos.md)
- [Esquema de base de datos](./database/esquema-mongodb.md)

---

## 📝 Licencia

Proyecto de carácter académico / educativo.
