# 🏗️ Arquitectura del Proyecto – El Palacio del Morfi

## 1. Tipo de Arquitectura

Se adopta una **arquitectura en capas (Layered Architecture)** de tipo **Cliente-Servidor**, con separación clara entre:

- **Frontend** (capa de presentación)
- **Backend / API REST** (capa de lógica de negocio y controladores)
- **Base de Datos** (capa de persistencia)

Esta decisión permite:
- Independencia entre frontend y backend
- Fácil despliegue por separado (Vercel + Render)
- Escalabilidad futura
- Mantenibilidad del código

No se utiliza arquitectura de microservicios (fuera de alcance del MVP).

---

## 2. Diagrama de Capas

```
┌─────────────────────────────────────────────────────────┐
│                   Cliente (Navegador)                   │
│         Celular del mozo / Tablet de cocina / PC        │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP / Fetch API
                           ▼
┌─────────────────────────────────────────────────────────┐
│                      FRONTEND                           │
│         HTML5 + CSS3 + JavaScript (Vanilla)             │
│     (Menú Digital · Panel Mozo · Panel Cocina)          │
└──────────────────────────┬──────────────────────────────┘
                           │ REST API (JSON)
                           ▼
┌─────────────────────────────────────────────────────────┐
│                       BACKEND                           │
│                  Node.js + Express                      │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │  Routers    │→ │  Servicios   │→ │   Modelos     │  │
│  │ (Control.)  │  │ (Lógica)     │  │  (Mongoose)   │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────┐
│                   BASE DE DATOS                         │
│               MongoDB Atlas (Cluster M0)                │
│     Colecciones: platos · pedidos · ventas              │
└─────────────────────────────────────────────────────────┘
```

---

## 3. Tecnologías Definitivas

| Capa                | Tecnología                              | Notas                                      |
|---------------------|-----------------------------------------|--------------------------------------------|
| Frontend            | HTML5 + CSS3 + JavaScript Vanilla       | Prioridad a usabilidad móvil               |
| Estilos             | CSS puro + diseño responsive            | Sin frameworks pesados en el MVP           |
| Backend             | Node.js + Express                       | API REST                                   |
| ODM                 | Mongoose                                | Validaciones y esquemas                    |
| Base de Datos       | MongoDB Atlas                           | Cluster gratuito M0                        |
| Despliegue Frontend | Vercel                                  | Integración con GitHub                     |
| Despliegue Backend  | Render                                  | Integración con GitHub                     |
| Control de versiones| Git + GitHub                            | Repositorio único                          |

---

## 4. Justificación de Decisiones Técnicas

### ¿Por qué Node.js + Express?
- Unifica el lenguaje con el frontend (JavaScript).
- Ecosistema maduro y amplia documentación.
- Despliegue simple y gratuito en Render.
- Ideal para APIs REST ligeras.

### ¿Por qué MongoDB + Mongoose?
- Los pedidos contienen arrays de ítems (documentos anidados).
- No se requieren JOINs complejos.
- Flexibilidad de esquema (útil en etapa de MVP).
- Mongoose permite definir validaciones y tipado de forma clara.
- Alineado con el material cursado de NoSQL y ODM.

### ¿Por qué Frontend Vanilla (HTML/CSS/JS)?
- Menor curva de aprendizaje inicial.
- Carga más rápida en dispositivos móviles de mozos y cocina.
- Suficiente para el MVP.
- Posibilidad de migrar a React en fases posteriores sin reescribir la lógica de negocio.

### ¿Por qué arquitectura en capas?
- Separación de responsabilidades.
- Facilita pruebas y mantenimiento.
- Cumple con buenas prácticas vistas en la carrera.

---

## 5. Flujo de Datos Principal (ejemplo)

1. El mozo abre el panel en su celular → Frontend.
2. Selecciona platos y mesa → envía `POST /api/pedidos`.
3. Backend valida, crea documento en colección `pedidos` y registra la venta.
4. Panel de cocina consulta `GET /api/pedidos?estado=pendiente`.
5. Cuando el cocinero marca “listo”, se actualiza el estado del pedido (`PUT /api/pedidos/:id`).

---

## 6. Consideraciones de Seguridad (MVP)

- Validación de datos en backend mediante esquemas de Mongoose.
- CORS configurado solo para el dominio del frontend.
- En etapas posteriores: autenticación por roles (JWT).

---

## 7. Escalabilidad Futura

- Agregar autenticación y roles.
- Implementar WebSockets para actualizaciones en tiempo real.
- Separar servicios de notificaciones.
- Migrar frontend a React si se requiere mayor complejidad de UI.
