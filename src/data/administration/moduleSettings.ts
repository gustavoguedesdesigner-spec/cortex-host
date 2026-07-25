/** Parâmetros configuráveis por módulo (seções 47-53) — valores demonstrativos, editáveis apenas no protótipo. */

export const cmvModuleSettings = {
  metaConsolidada: 0.325,
  metaPorUnidade: true,
  regraDeCusto: 'Custo médio ponderado',
  periodoFechamento: 'Mensal, com fechamento semanal parcial',
  tolerancia: 0.02,
  qualidadeMinima: 'Confiança média',
  bloqueios: 'Fechamento bloqueado com contagens pendentes',
  aprovadores: ['Diretor de Operações', 'Administrador Corporativo'],
  alertas: ['CMV real 2 p.p. acima da meta', 'Custo desatualizado há mais de 30 dias'],
}

export const estoqueModuleSettings = {
  estoqueMinimoPadrao: '3 dias de cobertura',
  estoqueMaximoPadrao: '10 dias de cobertura',
  toleranciaInventario: 0.03,
  contagemCega: true,
  frequenciaContagem: 'Semanal, por categoria',
  necessidadeRecontagem: 'Divergência acima de 5%',
  aprovacaoAjustes: 'Obrigatória acima de R$ 100',
  saldoNegativo: 'Bloqueado — exige ajuste manual aprovado',
  transferencias: 'Requer aprovação da unidade de destino',
  perdas: 'Registro obrigatório com motivo',
}

export const comprasModuleSettings = {
  alcadas: 'Ver Alçadas de Compras',
  cotacaoObrigatoria: 'Acima de R$ 5.000',
  numeroMinimoFornecedores: 2,
  variacaoPrecoMaxima: 0.08,
  compraEmergencial: 'Exige segundo aprovador',
  fornecedorBloqueado: 'Impede emissão automática do pedido',
  pedidosDuplicados: 'Alerta automático em 48h',
  estoqueEmTransito: 'Considerado na cobertura projetada',
  orcamento: 'Mensal, por unidade',
}

export const recebimentoModuleSettings = {
  checklistObrigatorio: true,
  toleranciaQuantidade: 0.02,
  toleranciaPreco: 0.03,
  validadeMinima: '60% da validade total do produto',
  temperatura: 'Obrigatória para itens refrigerados e congelados',
  documentos: 'Nota fiscal obrigatória',
  aprovacaoDivergencias: 'Gerente de Unidade, com escalonamento acima da tolerância',
  quarentena: 'Automática para divergência de temperatura ou validade',
  recebimentoParcial: 'Permitido, com pendência registrada',
}

export const fichasModuleSettings = {
  origemCusto: 'Último custo de compra',
  aprovadores: ['Chef Executivo', 'Operações', 'Financeiro', 'Administrador Corporativo'],
  vigencia: 'Indeterminada, sujeita a revisão',
  tolerancias: 'Custo desatualizado após 30 dias',
  revisaoPeriodica: 'Trimestral',
  fichaObrigatoria: 'Obrigatória para todo produto vendável',
  excecaoPorUnidade: 'Não permitida sem justificativa registrada',
  publicacao: 'Exige aprovação corporativa',
}

export const bibliotecaModuleSettings = {
  revisaoObrigatoria: 'Anual para procedimentos críticos',
  validade: '12 meses após publicação',
  confirmacaoLeitura: true,
  treinamentosVinculados: true,
  checklistsVinculados: true,
  evidencias: 'Foto ou assinatura digital',
  responsaveis: 'Definidos por área operacional',
  aprovacoes: 'Gestão e Administrador Corporativo',
}

export const assistenteModuleSettings = {
  modulosAcessiveis: ['Central', 'CMV', 'Estoque', 'Compras', 'Fichas Técnicas', 'Biblioteca', 'Administração'],
  escopoDados: 'Respeita perfil e unidade do usuário autenticado',
  perguntasPermitidas: 'Perguntas operacionais e administrativas dentro do escopo do usuário',
  exibicaoCustos: 'Somente para perfis com permissão de visualizar custos',
  exibicaoMargens: 'Somente para perfis com permissão de visualizar margens',
  acoesQuePodeSugerir: ['Criar ação', 'Abrir revisão', 'Comparar unidades'],
  acoesQueExigemConfirmacao: ['Aprovar', 'Publicar', 'Reabrir', 'Excluir'],
  retencaoHistorico: '90 dias',
  nivelDetalhamento: 'Resumido, com opção de abrir o módulo completo',
}
