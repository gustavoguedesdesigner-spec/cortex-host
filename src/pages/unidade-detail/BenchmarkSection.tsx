import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Card } from '@/components/ui/Card'
import { SectionHeader } from '@/components/ui/SectionHeader'
import { Button } from '@/components/ui/Button'
import type { BenchmarkRow } from '@/types'

interface BenchmarkSectionProps {
  comparadoComNome: string
  comparadoComId: string
  linhas: BenchmarkRow[]
  insight: string
  unitLabel: string
}

export function BenchmarkSection({ comparadoComNome, comparadoComId, linhas, insight, unitLabel }: BenchmarkSectionProps) {
  const navigate = useNavigate()

  return (
    <section>
      <SectionHeader title={`O que ${comparadoComNome.replace('Salvador ', '')} está fazendo diferente?`} description="Benchmark interno — hipótese operacional, não uma conclusão definitiva" />
      <Card className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <table className="w-full text-support">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pr-4 text-label text-ink-tertiary">Métrica</th>
                <th className="text-right py-2 px-4 text-label text-ink-primary">{unitLabel}</th>
                <th className="text-right py-2 pl-4 text-label text-ink-primary">{comparadoComNome.replace('Salvador ', '')}</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((row) => (
                <tr key={row.metrica} className="border-b border-border last:border-b-0">
                  <td className="py-2 pr-4 text-ink-tertiary">{row.metrica}</td>
                  <td className="py-2 px-4 text-right text-danger font-medium">{row.moinhos}</td>
                  <td className="py-2 pl-4 text-right text-success font-medium">{row.serra}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-support text-ink-secondary leading-relaxed">{insight}</p>
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="secondary">Comparar processos</Button>
          <Button size="sm" variant="secondary">Criar checklist</Button>
          <Button size="sm" variant="ghost" rightIcon={<ArrowRight className="h-3.5 w-3.5" />} onClick={() => navigate(`/unidades/${comparadoComId}`)}>
            Abrir {comparadoComNome.replace('Salvador ', '')}
          </Button>
        </div>
      </Card>
    </section>
  )
}
