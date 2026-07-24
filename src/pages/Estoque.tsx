import { ModulePlaceholder } from './ModulePlaceholder'
import { Select } from '@/components/ui/Select'

export default function Estoque() {
  return (
    <ModulePlaceholder
      eyebrow="Operação"
      title="Estoque"
      description="Posição de estoque por unidade, itens abaixo do mínimo, contagens pendentes e divergências recentes."
      extraFilters={
        <Select
          aria-label="Tipo de item"
          options={[
            { value: 'todos', label: 'Todos os itens' },
            { value: 'bebidas', label: 'Bebidas' },
            { value: 'perecivel', label: 'Perecíveis' },
            { value: 'seco', label: 'Estoque seco' },
          ]}
          className="w-44"
        />
      }
    />
  )
}
