import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BibliotecaHeader, type BibliotecaFilters } from '@/components/knowledge/BibliotecaHeader'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import {
  AreaComplianceSection,
  ComplianceSummarySection,
  ContinueSection,
  KnowledgeExecutiveSection,
  KnowledgeIndicatorsStrip,
  OpenItemsSection,
  PriorityContentSection,
  QuickAccessSection,
} from './knowledge/KnowledgeOverviewSections'
import { useKnowledge } from '@/hooks/useKnowledge'

/**
 * Biblioteca Operacional — visão geral. A narrativa vai de "o que está errado"
 * (resumo e conteúdos críticos) para "o que fazer agora" (acesso rápido,
 * continuar, conformidade), não uma parede de cards.
 */
export default function Biblioteca() {
  const navigate = useNavigate()
  const { allNonConformities, allRevisions } = useKnowledge()

  const [filters, setFilters] = useState<BibliotecaFilters>({
    busca: '',
    area: 'todas',
    tipo: 'todos',
    status: 'todos',
    unidade: 'todas',
    obrigatoriedade: 'todas',
  })

  function handleFilterChange(patch: Partial<BibliotecaFilters>) {
    setFilters((prev) => ({ ...prev, ...patch }))
    /* A busca leva à lista de documentos, onde os filtros têm efeito completo. */
    if (patch.busca !== undefined && patch.busca.length > 2) {
      navigate(`/biblioteca/documentos?busca=${encodeURIComponent(patch.busca)}`)
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <BibliotecaHeader
        filters={filters}
        onChange={handleFilterChange}
        onNovoConteudo={() => navigate('/biblioteca/documentos?novo=1')}
        onCriarChecklist={() => navigate('/biblioteca/checklists?novo=1')}
        onAtribuirTreinamento={() => navigate('/biblioteca/treinamentos?atribuir=1')}
      />

      <BibliotecaInternalNav active="visao-geral" />

      <div className="flex flex-col gap-12">
        <KnowledgeExecutiveSection
          onVerCriticos={() => document.getElementById('conteudos-criticos')?.scrollIntoView({ behavior: 'smooth' })}
          onVerTreinamentos={() => navigate('/biblioteca/treinamentos?status=pendente')}
          onAbrirConformidade={() => navigate('/biblioteca/conformidade')}
        />

        <KnowledgeIndicatorsStrip />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <PriorityContentSection />
          </div>
          <div className="lg:col-span-5">
            <ContinueSection />
          </div>
        </div>

        <QuickAccessSection />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <ComplianceSummarySection />
          </div>
          <div className="lg:col-span-5">
            <AreaComplianceSection />
          </div>
        </div>

        <OpenItemsSection naoConformidades={allNonConformities} revisoes={allRevisions} />
      </div>
    </div>
  )
}
