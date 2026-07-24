import { ModulePlaceholder } from './ModulePlaceholder'
import { Select } from '@/components/ui/Select'

export default function Recebimentos() {
  return (
    <ModulePlaceholder
      eyebrow="Suprimentos"
      title="Recebimentos"
      description="Leitura assistida de notas fiscais e conferência automática entre pedido, nota e recebimento físico."
      extraFilters={
        <Select
          aria-label="Status do recebimento"
          options={[
            { value: 'todos', label: 'Todos os status' },
            { value: 'conforme', label: 'Conforme' },
            { value: 'divergente', label: 'Com divergência' },
            { value: 'pendente', label: 'Pendente de conferência' },
          ]}
          className="w-48"
        />
      }
    />
  )
}
