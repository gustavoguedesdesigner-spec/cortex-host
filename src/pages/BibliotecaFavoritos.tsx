import { useNavigate } from 'react-router-dom'
import { Star } from 'lucide-react'
import { BibliotecaBreadcrumb } from '@/components/knowledge/BibliotecaBreadcrumb'
import { BibliotecaInternalNav } from '@/components/knowledge/BibliotecaInternalNav'
import { PageHero } from '@/components/ui/PageHero'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { EmptyState } from '@/components/ui/EmptyState'
import { Button } from '@/components/ui/Button'
import { KnowledgeStatusBadge, ObligationBadge } from '@/components/knowledge/KnowledgeBadges'
import { useKnowledge } from '@/hooks/useKnowledge'
import { documentPath } from './BibliotecaDocumentos'
import { areaLabels } from '@/data/knowledge/knowledgeSummary'

export default function BibliotecaFavoritos() {
  const navigate = useNavigate()
  const { allDocuments, toggleFavorito } = useKnowledge()
  const favoritos = allDocuments.filter((d) => d.favorito)

  return (
    <div className="flex flex-col gap-6">
      <BibliotecaBreadcrumb trail={[{ label: 'Favoritos' }]} />
      <PageHero eyebrow="Conhecimento" title="Favoritos" description="Conteúdos marcados para acesso rápido." />
      <BibliotecaInternalNav active="documentos" />

      <SectionHeader title={`${favoritos.length} conteúdos favoritados`} />

      {favoritos.length === 0 ? (
        <EmptyState icon={<Star className="h-5 w-5" />} title="Nenhum favorito ainda" description="Marque documentos e procedimentos com a estrela para encontrá-los aqui rapidamente." action={<Button variant="secondary" onClick={() => navigate('/biblioteca/documentos')}>Ver documentos</Button>} />
      ) : (
        <div className="flex flex-col divide-y divide-border rounded-xl border border-border bg-surface">
          {favoritos.map((d) => (
            <div key={d.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
              <button onClick={() => navigate(documentPath(d))} className="min-w-0 flex-1 text-left">
                <p className="text-support font-medium text-ink-primary">{d.titulo}</p>
                <p className="text-caption text-ink-tertiary">
                  {d.codigo} · {areaLabels[d.area]}
                </p>
              </button>
              <div className="flex shrink-0 items-center gap-2">
                <KnowledgeStatusBadge status={d.status} />
                <ObligationBadge obrigatoriedade={d.obrigatoriedade} />
                <Button size="sm" variant="ghost" leftIcon={<Star className="h-3.5 w-3.5 fill-accent text-accent" strokeWidth={1.7} />} onClick={() => toggleFavorito(d.id)}>
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
