import {
  LayoutGrid,
  Building2,
  Percent,
  Package,
  ShoppingCart,
  Truck,
  Users,
  BookOpen,
  Library,
  Sparkles,
  Settings,
} from 'lucide-react'
import type { NavGroupData } from '@/types'

/**
 * Configuracao central da navegacao principal.
 * Alterar aqui reflete automaticamente em Sidebar, MobileDrawerNav e breadcrumbs.
 */
export const navGroups: NavGroupData[] = [
  {
    label: 'Operação',
    items: [
      { label: 'Central de Operações', path: '/', icon: LayoutGrid },
      { label: 'Unidades', path: '/unidades', icon: Building2 },
      { label: 'CMV', path: '/cmv', icon: Percent },
      { label: 'Estoque', path: '/estoque', icon: Package },
    ],
  },
  {
    label: 'Suprimentos',
    items: [
      { label: 'Compras', path: '/compras', icon: ShoppingCart, emConstrucao: true },
      { label: 'Recebimentos', path: '/recebimentos', icon: Truck, emConstrucao: true },
      { label: 'Fornecedores', path: '/fornecedores', icon: Users, emConstrucao: true },
    ],
  },
  {
    label: 'Conhecimento',
    items: [
      { label: 'Fichas Técnicas', path: '/fichas-tecnicas', icon: BookOpen },
      { label: 'Biblioteca', path: '/biblioteca', icon: Library, emConstrucao: true },
    ],
  },
  {
    label: 'Inteligência',
    items: [{ label: 'Assistente CORTEX', path: '/assistente', icon: Sparkles, emConstrucao: true }],
  },
  {
    label: 'Administração',
    items: [{ label: 'Configurações', path: '/configuracoes', icon: Settings }],
  },
]

export const allNavItems = navGroups.flatMap((g) => g.items)
