export interface CreatedAction {
  id: string
  titulo: string
  descricao: string
  unidade: string
  responsavel: string
  prazo: string
  prioridade: 'critica' | 'alta' | 'media'
  ocorrenciaId?: string
  criadoEm: string
}
