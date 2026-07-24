export interface QuickQuestionLink {
  label: string
  path?: string
}

export interface QuickQuestion {
  id: string
  pergunta: string
  resposta: string
  links?: QuickQuestionLink[]
}
