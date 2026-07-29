import { PageBreadcrumb } from '@/components/ui/PageHero'

export function ReceivingBreadcrumb({ trail }: { trail: { label: string; path?: string }[] }) {
  return <PageBreadcrumb trail={[{ label: 'Recebimentos', path: '/recebimentos' }, ...trail]} />
}
