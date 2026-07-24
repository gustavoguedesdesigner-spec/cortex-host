import { ModulePlaceholder } from './ModulePlaceholder'
import { Select } from '@/components/ui/Select'

export default function CMV() {
  return (
    <ModulePlaceholder
      eyebrow="Operação"
      title="CMV"
      description="Comparação entre CMV teórico e real, explicação de desvios por categoria de insumo e impacto financeiro estimado."
      extraFilters={
        <Select
          aria-label="Categoria"
          options={[
            { value: 'todas', label: 'Todas as categorias' },
            { value: 'bebidas', label: 'Bebidas' },
            { value: 'carnes', label: 'Carnes' },
            { value: 'insumos', label: 'Insumos gerais' },
          ]}
          className="w-44"
        />
      }
    />
  )
}
