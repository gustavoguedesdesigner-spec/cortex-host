import type { Procedure } from '@/types'

/**
 * Conteudo estruturado dos procedimentos (secoes 22-24). Separado de
 * documents.ts porque nem todo documento e um procedimento com etapas —
 * politicas, comunicados e guias nao tem esta estrutura.
 * POP-COZ-004 e o procedimento aprofundado para demonstracao.
 */
export const procedures: Procedure[] = [
  {
    documentId: 'pop-coz-004',
    objetivo:
      'Garantir que todas as porções de blend bovino sejam produzidas no peso padrão, com rastreabilidade de lote e sem perda por correção visual, mantendo o CMV dentro do previsto pela ficha técnica.',
    escopo:
      'Aplica-se ao porcionamento de blend bovino para todos os hambúrgueres do cardápio, em todas as unidades, durante o preparo do mise en place e reposições ao longo do serviço.',
    responsaveis: [
      'Chef ou cozinheiro responsável pelo turno — execução e conferência',
      'Gerente de unidade — validação do registro diário',
      'Chef Executivo — manutenção do procedimento e tratamento de desvios recorrentes',
    ],
    materiais: [
      'Balança digital calibrada (precisão de 1 g)',
      'Bandejas identificadas por lote',
      'Etiquetas de identificação com data, horário e lote',
      'Filme plástico próprio para alimentos',
      'Luvas descartáveis e touca',
      'Termômetro digital',
    ],
    seguranca: [
      'Higienizar as mãos e utilizar luvas antes de manipular o blend',
      'Manter o produto fora da zona de risco de temperatura (acima de 5 °C) pelo menor tempo possível',
      'Não reutilizar bandejas sem higienização completa',
      'Descartar luvas ao trocar de lote ou produto',
    ],
    etapas: [
      {
        numero: 1,
        titulo: 'Preparar o posto',
        itens: [
          'Higienizar a balança e a superfície de trabalho',
          'Validar a calibração da balança com peso padrão de referência',
          'Separar bandejas limpas e identificadas',
          'Verificar a temperatura da câmara refrigerada',
          'Utilizar equipamento de proteção — luvas e touca',
        ],
      },
      {
        numero: 2,
        titulo: 'Separar o blend',
        itens: [
          'Retirar o lote correto seguindo a ordem de validade (PVPS)',
          'Conferir a validade impressa na embalagem',
          'Registrar o número do lote na planilha de produção',
          'Manter o produto sob refrigeração até o momento da pesagem',
        ],
      },
      {
        numero: 3,
        titulo: 'Porcionar',
        itens: [
          'Peso padrão: 180 g por porção',
          'Tolerância aceita: ±5 g',
          'Realizar a pesagem individual de cada porção',
          'Não corrigir o peso visualmente sem conferência na balança',
        ],
        controles: [
          { parametro: 'Peso da porção', padrao: '180 g', tolerancia: '±5 g', frequencia: 'Cada porção', responsavel: 'Cozinheiro', evidencia: 'Registro de produção' },
        ],
      },
      {
        numero: 4,
        titulo: 'Armazenar',
        itens: [
          'Identificar a bandeja com produto, lote e responsável',
          'Informar o horário do porcionamento na etiqueta',
          'Refrigerar imediatamente após o porcionamento',
          'Respeitar a validade interna de 24 horas para porções preparadas',
        ],
      },
      {
        numero: 5,
        titulo: 'Registrar',
        itens: [
          'Registrar a quantidade total produzida',
          'Registrar o rendimento obtido em relação ao peso bruto',
          'Registrar perdas e aparas separadamente',
          'Identificar o responsável pelo porcionamento',
          'Anexar evidência de pesagem do lote',
        ],
      },
    ],
    controles: [
      { parametro: 'Peso da porção', padrao: '180 g', tolerancia: '±5 g', frequencia: 'Cada porção', responsavel: 'Cozinheiro', evidencia: 'Registro de produção' },
      { parametro: 'Temperatura do produto', padrao: '0 °C a 4 °C', tolerancia: 'Máx. 5 °C por até 20 min', frequencia: 'Início e fim do lote', responsavel: 'Cozinheiro', evidencia: 'Leitura do termômetro' },
      { parametro: 'Validade interna da porção', padrao: '24 horas', tolerancia: 'Sem tolerância', frequencia: 'Cada bandeja', responsavel: 'Cozinheiro', evidencia: 'Etiqueta com data e horário' },
      { parametro: 'Calibração da balança', padrao: 'Peso de referência conferido', tolerancia: '±1 g', frequencia: 'Diária, na abertura', responsavel: 'Chef do turno', evidencia: 'Checklist de abertura' },
      { parametro: 'Rendimento do lote', padrao: 'Conforme ficha técnica', tolerancia: '−3% a +1%', frequencia: 'Cada lote', responsavel: 'Chef do turno', evidencia: 'Registro de produção' },
    ],
    evidenciasObrigatorias: [
      'Registro de produção com quantidade, rendimento e perdas',
      'Etiqueta de identificação com lote, data e horário',
      'Leitura de temperatura no início e no fim do lote',
      'Assinatura do responsável pelo turno',
    ],
    naoConformidadesComuns: [
      'Porções fora da tolerância de peso',
      'Ausência de identificação de lote ou horário na bandeja',
      'Correção visual do peso sem uso da balança',
      'Produto mantido fora da refrigeração acima do tempo permitido',
      'Registro de produção incompleto ou sem responsável',
    ],
    acoesCorretivas: [
      'Repesar o lote e corrigir as porções fora do padrão',
      'Refazer a identificação completa das bandejas',
      'Reforçar o treinamento de porcionamento com a equipe do turno',
      'Revisar a calibração da balança e registrar a conferência',
      'Registrar não conformidade e abrir ação corretiva quando houver reincidência',
    ],
  },
  {
    documentId: 'pop-rec-002',
    objetivo:
      'Assegurar que todo produto refrigerado recebido seja conferido contra pedido e nota fiscal, com verificação de temperatura, validade e lote antes da entrada no estoque.',
    escopo: 'Aplica-se ao recebimento de produtos refrigerados e congelados em todas as unidades.',
    responsaveis: ['Conferente ou gerente de unidade — execução', 'Gestor de Operações — tratamento de divergências recorrentes'],
    materiais: ['Termômetro digital calibrado', 'Pedido de compra impresso ou no sistema', 'Nota fiscal do fornecedor', 'Formulário de divergência'],
    seguranca: ['Não iniciar a conferência com o veículo aberto por tempo prolongado', 'Recusar produto com embalagem violada', 'Higienizar as mãos antes do manuseio'],
    etapas: [
      { numero: 1, titulo: 'Identificar o pedido', itens: ['Localizar o pedido de compra correspondente', 'Conferir o fornecedor e a unidade de destino', 'Verificar se há saldo pendente de entregas anteriores'] },
      { numero: 2, titulo: 'Conferir o documento', itens: ['Comparar a nota fiscal com o pedido', 'Conferir preço unitário acordado', 'Registrar divergência de preço quando houver'] },
      { numero: 3, titulo: 'Conferir a quantidade física', itens: ['Contar as unidades recebidas', 'Comparar com o pedido e com a nota', 'Registrar a quantidade efetivamente aceita'] },
      { numero: 4, titulo: 'Verificar temperatura, validade e lote', itens: ['Medir a temperatura do produto na chegada', 'Conferir a validade mínima aceitável', 'Registrar o lote recebido'], controles: [{ parametro: 'Temperatura de recebimento', padrao: '0 °C a 4 °C', tolerancia: 'Máx. 6 °C', frequencia: 'Cada entrega', responsavel: 'Conferente', evidencia: 'Leitura registrada' }] },
      { numero: 5, titulo: 'Decidir sobre divergências', itens: ['Aceitar parcialmente e manter o saldo pendente no pedido', 'Recusar itens fora do padrão de temperatura ou validade', 'Registrar a divergência com evidência', 'Comunicar Compras quando houver impacto no pedido'] },
    ],
    controles: [
      { parametro: 'Temperatura de recebimento', padrao: '0 °C a 4 °C', tolerancia: 'Máx. 6 °C', frequencia: 'Cada entrega', responsavel: 'Conferente', evidencia: 'Leitura registrada' },
      { parametro: 'Validade mínima na entrada', padrao: '70% da vida útil', tolerancia: 'Mín. 60%', frequencia: 'Cada item', responsavel: 'Conferente', evidencia: 'Registro de recebimento' },
      { parametro: 'Divergência de quantidade', padrao: 'Zero', tolerancia: 'Sem tolerância', frequencia: 'Cada entrega', responsavel: 'Conferente', evidencia: 'Formulário de divergência' },
    ],
    evidenciasObrigatorias: ['Leitura de temperatura na chegada', 'Registro da quantidade aceita', 'Formulário de divergência quando aplicável'],
    naoConformidadesComuns: ['Entrada de produto sem conferência de temperatura', 'Aceite total com quantidade divergente', 'Ausência de registro de lote'],
    acoesCorretivas: ['Registrar divergência no pedido e manter o saldo pendente', 'Cobrar o fornecedor formalmente', 'Reforçar treinamento de recebimento'],
  },
]

export function getProcedureByDocumentId(documentId: string): Procedure | undefined {
  return procedures.find((p) => p.documentId === documentId)
}
