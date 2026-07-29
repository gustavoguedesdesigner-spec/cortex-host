import type { Training, TrainingAssignment } from '@/types'

/**
 * Treinamentos (secoes 29-36). TRN-REC-003 e o treinamento aprofundado.
 * Os totais atribuidos/concluidos/pendentes sao os oficiais do brief; a lista
 * de trainingAssignments e uma amostra nominal, nao a enumeracao das 142.
 */
export const trainings: Training[] = [
  {
    id: 'trn-rec-003',
    codigo: 'TRN-REC-003',
    titulo: 'Recebimento de Produtos Refrigerados',
    descricao: 'Como conferir pedido, documento, quantidade, temperatura, validade e lote — e o que fazer diante de divergências.',
    area: 'recebimento',
    formato: 'combinado',
    duracaoMin: 24,
    obrigatoriedade: 'obrigatorio',
    publico: ['Conferente', 'Gerente de unidade', 'Estoquista'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    modulos: [
      {
        numero: 1,
        titulo: 'Identificação do pedido',
        conteudo:
          'Antes de qualquer conferência física, localize o pedido de compra correspondente à entrega. Verifique o fornecedor, a unidade de destino e se existe saldo pendente de entregas anteriores — um mesmo pedido pode ter mais de uma remessa.',
        duracaoMin: 4,
        materialRelacionado: 'pop-rec-002',
        perguntaVerificacao: 'O que fazer quando a entrega corresponde a um pedido com saldo pendente anterior?',
        respostaEsperada: 'Conferir a remessa atual e manter o saldo restante em aberto no pedido.',
      },
      {
        numero: 2,
        titulo: 'Conferência do documento',
        conteudo:
          'Compare a nota fiscal com o pedido de compra: itens, quantidades e preço unitário acordado. Divergências de preço devem ser registradas mesmo quando a quantidade está correta — elas impactam o CMV e o histórico do fornecedor.',
        duracaoMin: 5,
        materialRelacionado: 'pop-rec-002',
        perguntaVerificacao: 'A nota traz preço acima do acordado, mas a quantidade está correta. O que fazer?',
        respostaEsperada: 'Registrar a divergência de preço e comunicar Compras.',
      },
      {
        numero: 3,
        titulo: 'Quantidade física',
        conteudo:
          'Conte fisicamente o que chegou. Não assuma que a nota reflete a carga. Registre a quantidade efetivamente aceita — é ela que entra no estoque, não a quantidade da nota.',
        duracaoMin: 5,
        materialRelacionado: 'pop-rec-002',
        perguntaVerificacao: 'A nota registra 30 caixas e chegaram 28. Qual quantidade entra no estoque?',
        respostaEsperada: 'Apenas as 28 caixas efetivamente aceitas.',
      },
      {
        numero: 4,
        titulo: 'Temperatura, validade e lote',
        conteudo:
          'Meça a temperatura na chegada, ainda no veículo quando possível. A faixa aceita é de 0 °C a 4 °C, com tolerância máxima de 6 °C. Confira a validade mínima e registre o lote — sem lote não há rastreabilidade.',
        duracaoMin: 6,
        materialRelacionado: 'pop-rec-002',
        perguntaVerificacao: 'O produto chegou a 8 °C. Qual a decisão correta?',
        respostaEsperada: 'Recusar o item por estar fora da faixa de temperatura e registrar a ocorrência.',
      },
      {
        numero: 5,
        titulo: 'Divergências e decisão',
        conteudo:
          'Diante de divergência, decida entre aceite parcial (mantendo saldo pendente), recusa do item ou recusa total. Registre sempre a evidência e o motivo. O estoque só é atualizado com a quantidade aceita.',
        duracaoMin: 4,
        materialRelacionado: 'pop-rec-002',
        perguntaVerificacao: 'Quando o aceite parcial é a decisão adequada?',
        respostaEsperada: 'Quando parte da carga está conforme e o saldo pode ser entregue depois.',
      },
    ],
    avaliacao: [
      {
        id: 'q1',
        enunciado: 'O pedido registra 30 caixas, a nota registra 30 e foram recebidas 28. Qual ação deve ser realizada?',
        alternativas: [
          'Concluir normalmente',
          'Alterar o pedido para 28 caixas',
          'Registrar divergência de quantidade e seguir o fluxo de decisão',
          'Recusar toda a entrega obrigatoriamente',
        ],
        indiceCorreto: 2,
        explicacao:
          'A divergência de quantidade deve ser registrada e o fluxo de decisão seguido: aceita-se a quantidade conferida e mantém-se o saldo pendente no pedido. Alterar o pedido apagaria a diferença, e recusar tudo seria desproporcional.',
      },
      {
        id: 'q2',
        enunciado: 'Um produto refrigerado chega com temperatura de 8 °C. Qual é a decisão correta?',
        alternativas: [
          'Aceitar e resfriar imediatamente na câmara',
          'Recusar o item e registrar a ocorrência com evidência',
          'Aceitar e registrar apenas uma observação',
          'Aceitar se a validade estiver longa',
        ],
        indiceCorreto: 1,
        explicacao: 'A faixa aceita é de 0 °C a 4 °C, com tolerância máxima de 6 °C. A 8 °C o item está fora do padrão e deve ser recusado, com registro de evidência.',
      },
      {
        id: 'q3',
        enunciado: 'Qual quantidade deve ser lançada no estoque após um aceite parcial?',
        alternativas: [
          'A quantidade da nota fiscal',
          'A quantidade do pedido de compra',
          'A quantidade efetivamente aceita na conferência',
          'A maior entre nota e pedido',
        ],
        indiceCorreto: 2,
        explicacao: 'O estoque é atualizado apenas com a quantidade efetivamente aceita — é o que de fato entrou na unidade.',
      },
    ],
    aproveitamentoMinimo: 0.8,
    validadeMeses: 12,
    atribuidos: 28,
    concluidos: 20,
    pendentes: 8,
    status: 'publicado',
    documentoRelacionado: 'pop-rec-002',
    checklistRelacionado: 'chk-rec-003',
    unidadesCriticas: ['moinhos', 'caxias-centro'],
  },
  {
    id: 'trn-coz-007',
    codigo: 'TRN-COZ-007',
    titulo: 'Porcionamento e controle de rendimento',
    descricao: 'Pesagem individual, tolerância, identificação de lote e registro de rendimento no porcionamento de carnes.',
    area: 'cozinha',
    formato: 'pratica_supervisionada',
    duracaoMin: 32,
    obrigatoriedade: 'obrigatorio',
    publico: ['Chef', 'Cozinheiro', 'Auxiliar de cozinha'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    modulos: [
      { numero: 1, titulo: 'Preparação do posto', conteudo: 'Higienização, calibração da balança e organização das bandejas antes de iniciar.', duracaoMin: 6, materialRelacionado: 'pop-coz-004', perguntaVerificacao: 'Com que frequência a balança deve ser conferida?', respostaEsperada: 'Diariamente, na abertura.' },
      { numero: 2, titulo: 'Pesagem individual', conteudo: 'Peso padrão de 180 g com tolerância de ±5 g, sempre com conferência na balança.', duracaoMin: 10, materialRelacionado: 'pop-coz-004', perguntaVerificacao: 'É aceitável corrigir o peso visualmente?', respostaEsperada: 'Não — a conferência deve ser feita na balança.' },
      { numero: 3, titulo: 'Identificação e armazenamento', conteudo: 'Etiqueta com produto, lote, data, horário e responsável; refrigeração imediata.', duracaoMin: 8, materialRelacionado: 'pop-coz-004', perguntaVerificacao: 'O que deve constar na etiqueta?', respostaEsperada: 'Produto, lote, data, horário e responsável.' },
      { numero: 4, titulo: 'Registro de rendimento', conteudo: 'Como registrar quantidade produzida, rendimento e perdas do lote.', duracaoMin: 8, materialRelacionado: 'pop-coz-004', perguntaVerificacao: 'Perdas e aparas devem ser registradas junto com a produção?', respostaEsperada: 'Devem ser registradas separadamente.' },
    ],
    avaliacao: [
      { id: 'q1', enunciado: 'Qual é o peso padrão e a tolerância da porção de blend?', alternativas: ['180 g com ±10 g', '180 g com ±5 g', '170 g com ±5 g', '200 g sem tolerância'], indiceCorreto: 1, explicacao: 'A versão 2.3 do POP-COZ-004 define 180 g com tolerância de ±5 g.' },
    ],
    aproveitamentoMinimo: 0.8,
    validadeMeses: 12,
    atribuidos: 34,
    concluidos: 27,
    pendentes: 7,
    status: 'publicado',
    documentoRelacionado: 'pop-coz-004',
    checklistRelacionado: 'chk-coz-002',
    unidadesCriticas: ['moinhos', 'caxias-centro'],
  },
  {
    id: 'trn-est-002',
    codigo: 'TRN-EST-002',
    titulo: 'Inventário e contagem cega',
    descricao: 'Metodologia de contagem cega, recontagem e tratamento de divergências de inventário.',
    area: 'estoque',
    formato: 'leitura_orientada',
    duracaoMin: 18,
    obrigatoriedade: 'obrigatorio',
    publico: ['Estoquista', 'Gerente de unidade'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    modulos: [
      { numero: 1, titulo: 'Por que contagem cega', conteudo: 'A contagem cega evita o viés de confirmação do saldo sistêmico.', duracaoMin: 6, materialRelacionado: 'pop-est-001', perguntaVerificacao: 'O contador deve ver o saldo do sistema?', respostaEsperada: 'Não.' },
      { numero: 2, titulo: 'Recontagem e divergências', conteudo: 'Quando solicitar recontagem e como justificar divergências.', duracaoMin: 12, materialRelacionado: 'pop-est-001', perguntaVerificacao: 'Quando a recontagem é obrigatória?', respostaEsperada: 'Quando a divergência ultrapassa a tolerância definida.' },
    ],
    avaliacao: [
      { id: 'q1', enunciado: 'Na contagem cega, o que o contador deve enxergar?', alternativas: ['O saldo sistêmico', 'Apenas a lista de itens a contar', 'A última contagem', 'O valor financeiro'], indiceCorreto: 1, explicacao: 'A contagem cega apresenta apenas os itens, sem o saldo esperado.' },
    ],
    aproveitamentoMinimo: 0.8,
    validadeMeses: 12,
    atribuidos: 22,
    concluidos: 21,
    pendentes: 1,
    status: 'publicado',
    documentoRelacionado: 'pop-est-001',
    checklistRelacionado: 'chk-est-007',
    unidadesCriticas: [],
  },
  {
    id: 'trn-seg-001',
    codigo: 'TRN-SEG-001',
    titulo: 'Boas práticas de segurança alimentar',
    descricao: 'Higiene pessoal, contaminação cruzada, controle de temperatura e validade.',
    area: 'seguranca_alimentar',
    formato: 'video',
    duracaoMin: 28,
    obrigatoriedade: 'obrigatorio',
    publico: ['Todos os colaboradores de operação'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    modulos: [
      { numero: 1, titulo: 'Higiene pessoal', conteudo: 'Lavagem das mãos, uniforme e uso de EPI.', duracaoMin: 8, perguntaVerificacao: 'Quando lavar as mãos?', respostaEsperada: 'Ao iniciar, trocar de tarefa e após qualquer contaminação.' },
      { numero: 2, titulo: 'Contaminação cruzada', conteudo: 'Separação de utensílios e superfícies por tipo de alimento.', duracaoMin: 10, perguntaVerificacao: 'Pode usar a mesma tábua para carne crua e salada?', respostaEsperada: 'Não.' },
      { numero: 3, titulo: 'Temperatura e validade', conteudo: 'Zona de risco, controle de câmaras e validade interna.', duracaoMin: 10, perguntaVerificacao: 'Qual é a zona de risco de temperatura?', respostaEsperada: 'Entre 5 °C e 60 °C.' },
    ],
    avaliacao: [
      { id: 'q1', enunciado: 'Qual é a zona de risco de temperatura para alimentos?', alternativas: ['0 °C a 5 °C', '5 °C a 60 °C', '60 °C a 90 °C', 'Abaixo de 0 °C'], indiceCorreto: 1, explicacao: 'Entre 5 °C e 60 °C a multiplicação microbiana é acelerada.' },
    ],
    aproveitamentoMinimo: 0.8,
    validadeMeses: 12,
    atribuidos: 42,
    concluidos: 36,
    pendentes: 6,
    status: 'publicado',
    unidadesCriticas: ['moinhos'],
  },
  {
    id: 'trn-com-004',
    codigo: 'TRN-COM-004',
    titulo: 'Requisições e alçadas de compra',
    descricao: 'Como abrir requisição, justificar compra emergencial e respeitar alçadas de aprovação.',
    area: 'compras',
    formato: 'apresentacao',
    duracaoMin: 16,
    obrigatoriedade: 'recomendado',
    publico: ['Gerente de unidade', 'Gestor Regional'],
    unidades: ['moinhos', 'caxias-centro', 'zona-norte', 'cidade-baixa', 'serra', 'caxias-norte'],
    modulos: [
      { numero: 1, titulo: 'Abertura de requisição', conteudo: 'Quando abrir, o que justificar e como avaliar alternativas.', duracaoMin: 8, perguntaVerificacao: 'A transferência entre unidades deve ser avaliada antes da compra?', respostaEsperada: 'Sim.' },
      { numero: 2, titulo: 'Alçadas e emergenciais', conteudo: 'Limites por valor e exigência de aprovação adicional em emergenciais.', duracaoMin: 8, perguntaVerificacao: 'Compra emergencial exige aprovação adicional?', respostaEsperada: 'Sim.' },
    ],
    avaliacao: [
      { id: 'q1', enunciado: 'Antes de abrir uma compra emergencial, o que deve ser avaliado?', alternativas: ['Nada, é urgente', 'Transferência entre unidades e saldo em trânsito', 'Somente o preço', 'Somente o prazo'], indiceCorreto: 1, explicacao: 'A transferência entre unidades e o estoque em trânsito devem ser avaliados antes de comprar.' },
    ],
    aproveitamentoMinimo: 0.8,
    validadeMeses: 24,
    atribuidos: 16,
    concluidos: 14,
    pendentes: 2,
    status: 'publicado',
    documentoRelacionado: 'pol-com-001',
    unidadesCriticas: [],
  },
]

export function getTrainingById(id: string): Training | undefined {
  return trainings.find((t) => t.id === id)
}

/** Amostra nominal de atribuicoes — os totais oficiais estao em knowledgeSummary. */
export const trainingAssignments: TrainingAssignment[] = [
  { id: 'atr-001', trainingId: 'trn-rec-003', colaborador: 'Marina Costa', funcao: 'Conferente', unitId: 'moinhos', prazo: '2026-07-25T18:00:00-03:00', obrigatorio: true, motivo: 'Atribuição por função', status: 'em_andamento', progressoPercentual: 65, modulosConcluidos: 3, ultimaAtividade: '2026-07-22T15:20:00-03:00', tentativas: 0, atrasado: false },
  { id: 'atr-002', trainingId: 'trn-rec-003', colaborador: 'Rafael Martins', funcao: 'Gerente de unidade', unitId: 'moinhos', prazo: '2026-07-20T18:00:00-03:00', obrigatorio: true, motivo: 'Não conformidade NC-0248', status: 'em_andamento', progressoPercentual: 40, modulosConcluidos: 2, ultimaAtividade: '2026-07-19T11:00:00-03:00', tentativas: 0, atrasado: true },
  { id: 'atr-003', trainingId: 'trn-rec-003', colaborador: 'Bruno Teles', funcao: 'Gerente de unidade', unitId: 'caxias-norte', prazo: '2026-07-28T18:00:00-03:00', obrigatorio: true, motivo: 'Atribuição por função', status: 'nao_iniciado', progressoPercentual: 0, modulosConcluidos: 0, tentativas: 0, atrasado: false },
  { id: 'atr-004', trainingId: 'trn-rec-003', colaborador: 'Juliana Prado', funcao: 'Gerente de unidade', unitId: 'caxias-centro', prazo: '2026-07-21T18:00:00-03:00', obrigatorio: true, motivo: 'Divergências de recebimento', status: 'em_andamento', progressoPercentual: 20, modulosConcluidos: 1, ultimaAtividade: '2026-07-18T09:40:00-03:00', tentativas: 0, atrasado: true },
  { id: 'atr-005', trainingId: 'trn-rec-003', colaborador: 'Carla Menezes', funcao: 'Estoquista', unitId: 'caxias-centro', prazo: '2026-07-26T18:00:00-03:00', obrigatorio: true, motivo: 'Atribuição por função', status: 'nao_iniciado', progressoPercentual: 0, modulosConcluidos: 0, tentativas: 0, atrasado: false },
  { id: 'atr-006', trainingId: 'trn-rec-003', colaborador: 'Diego Andrade', funcao: 'Gerente de unidade', unitId: 'cidade-baixa', prazo: '2026-08-02T18:00:00-03:00', obrigatorio: true, motivo: 'Atribuição por função', status: 'concluido', progressoPercentual: 100, modulosConcluidos: 5, ultimaAtividade: '2026-07-14T16:10:00-03:00', tentativas: 1, resultado: 0.93, atrasado: false },
  { id: 'atr-007', trainingId: 'trn-coz-007', colaborador: 'Paulo Ribeiro', funcao: 'Cozinheiro', unitId: 'moinhos', prazo: '2026-07-24T18:00:00-03:00', obrigatorio: true, motivo: 'Desvio de porcionamento', status: 'nao_iniciado', progressoPercentual: 0, modulosConcluidos: 0, tentativas: 0, atrasado: false },
  { id: 'atr-008', trainingId: 'trn-coz-007', colaborador: 'Sandra Lima', funcao: 'Auxiliar de cozinha', unitId: 'moinhos', prazo: '2026-07-19T18:00:00-03:00', obrigatorio: true, motivo: 'Desvio de porcionamento', status: 'em_andamento', progressoPercentual: 50, modulosConcluidos: 2, ultimaAtividade: '2026-07-17T14:00:00-03:00', tentativas: 0, atrasado: true },
  { id: 'atr-009', trainingId: 'trn-seg-001', colaborador: 'Rafael Nunes', funcao: 'Gerente de unidade', unitId: 'serra', prazo: '2026-08-10T18:00:00-03:00', obrigatorio: true, motivo: 'Reciclagem anual', status: 'concluido', progressoPercentual: 100, modulosConcluidos: 3, ultimaAtividade: '2026-07-05T10:30:00-03:00', tentativas: 1, resultado: 1, atrasado: false },
  { id: 'atr-010', trainingId: 'trn-seg-001', colaborador: 'Patricia Lins', funcao: 'Gerente de unidade', unitId: 'zona-norte', prazo: '2026-07-30T18:00:00-03:00', obrigatorio: true, motivo: 'Reciclagem anual', status: 'em_andamento', progressoPercentual: 33, modulosConcluidos: 1, ultimaAtividade: '2026-07-21T08:15:00-03:00', tentativas: 0, atrasado: false },
]

export function getAssignmentsByTraining(trainingId: string): TrainingAssignment[] {
  return trainingAssignments.filter((a) => a.trainingId === trainingId)
}

export function getPendingAssignments(): TrainingAssignment[] {
  return trainingAssignments.filter((a) => a.status !== 'concluido')
}
