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

### Public API (Developers)

Estas APIs son accesibles públicamente para que cualquier otro municipio o desarrollador pueda integrar los datos de StarsBlocks en otras aplicaciones.

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/public/stats` | Estadísticas globales de impacto (kg, puntos, txs) |
| GET | `/api/public/products` | Lista de materiales aceptados y su valor |
| GET | `/api/public/leaderboard` | Top 10 recicladores (solo iniciales por privacidad) |

#### Ejemplos de Respuesta

**GET /api/public/stats**
```json
{
  "total_recycled_kg": 279,
  "total_points_issued": 276.56,
  "total_transactions": 11,
  "timestamp": "2025-11-30T08:28:04.207Z"
}
```

**GET /api/public/products**
```json
{
  "products": [
    {
      "name": "PET (Botellas plástico)",
      "points_per_kg": 0.35,
      "description": "Recycle PET (Botellas plástico) to earn 0.35 points per kg."
    }
  ]
}
```

**GET /api/public/leaderboard**
```json
{
  "leaderboard": [
    {
      "name": "S.M.",
      "points": 156.51,
      "recycled_kg": 178
    },
    {
      "name": "A.L.",
      "points": 120.05,
      "recycled_kg": 101
    }
  ]
}
```
*Nota: Los nombres se muestran como iniciales para proteger la privacidad de los usuarios.*

## Mantenimiento

### Migración de Puntos

Si necesitas recalcular los puntos de transacciones existentes (por ejemplo, después de cambiar los valores de `pricePerKg`):

```bash
npx tsx scripts/migrate-points.ts
```

Este script:
- Conecta a la base de datos MongoDB
- Busca todas las transacciones
- Calcula los puntos basándose en `amount × pricePerKg` del producto
- Actualiza el campo `pointsEarned` en cada transacción

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