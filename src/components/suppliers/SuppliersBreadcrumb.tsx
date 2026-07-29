import { PageBreadcrumb } from '@/components/ui/PageHero'

export function SuppliersBreadcrumb({ trail }: { trail: { label: string; path?: string }[] }) {
  return <PageBreadcrumb trail={[{ label: 'Fornecedores', path: '/fornecedores' }, ...trail]} />
}
