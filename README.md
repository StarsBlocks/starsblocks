# StarBlocks

StarBlocks es una plataforma web construida con Next.js 13 (rutas app), TypeScript y estilos custom (globals + variables) que conecta a recicladores urbanos con recolectores y registra cada entrega sobre la blockchain de BSV para garantizar trazabilidad y recompensas transparentes.

## Stack técnico

- **Frontend**: Next.js 13 App Router, Server Components + Client Components según necesidad, CSS modularizado en `globals.css`.
- **Backend/API**: API Routes (`src/app/api/*`) que exponen users, collectors, productTypes, transactions y leaderboard agregados.
- **Base de datos**: MongoDB Atlas. El helper `connectToDatabase` gestiona la conexión y `lib/types` tipa Users, Collectors, Transactions y privacidad granular.
- **Blockchain**: `lib/blockchain` usa la wallet de BSV y scripts OP_RETURN para inscribir cada transacción (`registerWasteOnChain`). El hash `txHash` viaja en el modelo y se muestra al usuario para verificación.
- **Autenticación**: NextAuth (credenciales) con roles `user` y `collector`. Los dashboards usan `useSession` y redirecciones condicionales.
- **UI Reusable**: Componentes como `StarBlocksGame`, `PointsTracker`, `UserRecyclingExperience`, `SiteFooter`, `AuthNav`, etc. Animaciones accesibles (prefers-reduced-motion), skip-link global y semántica ARIA.

## Diseño e interacción

- **Home / Landing**: Panel hero con animaciones de la estrella, CTA primario/secundario y pie de página legal. Emula un HUD urbano y muestra la narrativa.
- **Dashboard usuario**: Nave con header, panel de credenciales, wallet copy, sección de estadísticas (StarBlocksGame, PointsTracker), timeline de bloques y accesos a datos sensibles mediante un panel que actúa como modal.
- **Dashboard recolector**: Header distintivo, formulario para registrar recolecciones (con validaciones, selects dependientes), tabla en vivo de transacciones y llamado a un leaderboard de ubicaciones.
- **Leaderboard**: Página dedicada accesible desde el CTA para recolectores. Consulta `/api/leaderboard` y muestra rankings segmentados por material con gradientes y tarjetas responsive.
- **Accesibilidad**: Skip-link, focus visible, roles/aria-live en formularios y paneles, soporte para reduces motion, colores con contraste AA y mensajes de error con `role="alert"`.

## Funcionalidad y flujo

1. **Registro / Login de usuarios**: Formularios con validaciones mínimas, asistencia para coleccionistas y manejo de errores en vivo.
2. **Registro de recolectores**: Form de múltiples campos con cascadas (comunidad → provincia → municipio) usando `CustomSelect`.
3. **Registro de transacciones**: El recolector ingresa wallet del usuario, selecciona material y kilos; el backend verifica datos, calcula puntos y escribe en blockchain. La tabla y timeline se actualizan vía `aria-live`.
4. **Experiencia del usuario**: Visualiza su progreso en bloques (StarBlocksGame), ranking por material (PointsTracker) y cronología (RecyclingGraph). Panel seguro para obtener llave privada mediante confirmación de contraseña.
5. **Leaderboard dinámico**: Agregación de transacciones por categoría y ubicación, mostrando top 5 ubicaciones por material.

## Problema e impacto

Las cadenas de reciclaje sufren falta de trazabilidad y baja confianza entre ciudadanos y operadores. StarBlocks:

- **Transparencia**: Cada entrega genera un hash blockchain verificable (Whatsonchain). Usuarios y administraciones pueden auditar el flujo.
- **Gamificación + recompensas**: Cada kilo es un bloque; completar categorías llena la estrella y habilita futuras recompensas. Se fomenta la constancia.
- **Datos abiertos**: Leaderboard por categorías y regiones revela qué comunidades son más activas, incentivando competencia positiva y políticas públicas basadas en datos.
- **Privacidad configurable**: Usuarios pueden decidir si participan en rankings o comparten datos, alineándose con normativas locales.

## Trazabilidad del reciclaje

La app documenta cada recolección con:

- Usuario (wallet y nombre), recolector (zona, empresa), material (productType), kilos y puntos.
- Hash blockchain (`txHash`) para cada registro `validated`.
- API `/api/transactions` para consultar por usuario o recolector; `useRecyclingHistory` alimenta dashboards y timeline.
- Leaderboard cruzado con geografía (council/province/community) para visibilidad territorial.

## Próximas funcionalidades

- **Validación on-chain**: Endpoint `verifyTransaction` pendiente de implementar para comprobar el estatus de cada hash.
- **Notificaciones en tiempo real**: WebSockets o SSE para avisar al instante nuevos registros y movimientos en ranking.
- **Capas de IA / predicción**: Sugerir rutas óptimas a recolectores o recompensas personalizadas según hábitos.
- **Apps móviles / NFC**: Integración nativa para escanear residuos, leer chips y registrar sin fricción.
- **Panel administrativo**: Estadísticas globales, exportaciones y controles de privacidad per user.

## Instalación rápida

1. **Instalar dependencias**
   ```bash
   npm install
   ```
2. **Configurar variables**
   ```bash
   cp .env.example .env.local
   # Editar MONGODB_URI, credenciales NextAuth, wallet BSV, etc.
   ```
3. **Ejecutar**
   ```bash
   npm run dev
   ```
   Visita http://localhost:3000

## API relevante

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/transactions?userId=...&collectorId=...` | Historial filtrado |
| POST | `/api/transactions` | Registrar recolección (wallet, producto, kilos) |
| GET | `/api/leaderboard` | Ranking de ubicaciones por categoría |
| GET/POST | `/api/users`, `/api/collectors`, `/api/products` | CRUD básico |
