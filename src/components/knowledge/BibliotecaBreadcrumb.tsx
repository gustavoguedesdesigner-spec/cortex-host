import { PageBreadcrumb } from '@/components/ui/PageHero'

/** Breadcrumb da Biblioteca — sempre ancorado em /biblioteca. */
export function BibliotecaBreadcrumb({ trail }: { trail: { label: string; path?: string }[] }) {
  return <PageBreadcrumb trail={[{ label: 'Biblioteca', path: '/biblioteca' }, ...trail]} />
}
