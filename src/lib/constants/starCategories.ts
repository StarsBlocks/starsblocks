export interface StarCategory {
  key: 'vidrio' | 'papel' | 'metal' | 'aceite' | 'envases'
  label: string
  description: string
  keywords: string[]
  colorVar: string
}

export const starCategories: StarCategory[] = [
  {
    key: 'vidrio',
    label: 'Vidrio',
    description:
      'Botellas y frascos transparentes se codifican en verde neón para un seguimiento impecable.',
    keywords: ['vidrio', 'glass', 'botella', 'frasco'],
    colorVar: 'var(--block-vidrio)',
  },
  {
    key: 'papel',
    label: 'Papel',
    description:
      'Cartón y fibras se vuelven bloques celestes para monitorear fardos limpios.',
    keywords: ['papel', 'carton', 'cartón', 'paper'],
    colorVar: 'var(--block-papel)',
  },
  {
    key: 'metal',
    label: 'Metal',
    description:
      'Latas y chatarra ligera inspiran destellos dorados de alto valor.',
    keywords: ['metal', 'aluminio', 'cobre', 'hierro', 'chatarra', 'acero'],
    colorVar: 'var(--block-metal)',
  },
  {
    key: 'aceite',
    label: 'Aceite',
    description:
      'Residuos aceitosos brillan en naranja ámbar para activar protocolos de recuperación segura.',
    keywords: ['aceite', 'oil'],
    colorVar: 'var(--block-aceite)',
  },
  {
    key: 'envases',
    label: 'Envases',
    description:
      'Plásticos multicolor forman el punto violeta para medir el flujo hacia nuevos productos.',
    keywords: ['envase', 'pet', 'plástico', 'plastico', 'hdpe'],
    colorVar: 'var(--block-envases)',
  },
]

export type StarCategoryKey = (typeof starCategories)[number]['key']

export function matchStarCategory(productName: string): StarCategory {
  const normalized = productName.toLowerCase()
  const fallback = starCategories[starCategories.length - 1]

  for (const category of starCategories) {
    if (category.keywords.some((keyword) => normalized.includes(keyword))) {
      return category
    }
  }

  return fallback
}
