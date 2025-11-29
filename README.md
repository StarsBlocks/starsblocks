# StarsBlocks

Registro de basura en blockchain.

## Requisitos

- Node.js 18+
- Cuenta en MongoDB Atlas (gratis)

## Instalación

```bash
npm install
```

## Configuración

1. Copia el archivo de ejemplo:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` con tu URI de MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/starsblocks
```

## Ejecutar

```bash
npm run dev
```

Abre http://localhost:3000

## API Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/users` | Lista usuarios |
| POST | `/api/users` | Crear usuario |
| GET | `/api/waste` | Lista registros de basura |
| POST | `/api/waste` | Registrar basura |
| PATCH | `/api/waste/[id]` | Marcar como recolectado |

## Estructura

```
src/
├── app/
│   ├── api/          # Backend
│   └── page.tsx      # Frontend
└── lib/
    ├── mongodb.ts    # Conexión DB
    ├── types.ts      # Tipos TypeScript
    └── blockchain/   # Lógica blockchain
```