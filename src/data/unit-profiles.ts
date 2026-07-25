import type { UnitProfile } from '@/types'

export function getUnitProfile(unitId: string): UnitProfile | undefined {
  return unitProfiles[unitId]
}

/**
 * Perfis de investigacao por unidade — causas, evidencias, produtos,
 * comparacoes, fornecedores, acoes, atividade e perguntas ao CORTEX.
 * Moinhos recebe profundidade total (unidade critica principal da
 * demonstracao); as demais unidades possuem conteudo real e navegavel,
 * porem mais enxuto, conforme o foco definido para cada uma.
 */
export const unitProfiles: Record<string, UnitProfile> = {
  // ------------------------------------------------------------------
  // MOINHOS — unidade principal da demonstracao
  // ------------------------------------------------------------------
  moinhos: {
    unitId: 'moinhos',
    resumoExecutivo:
      'A unidade Moinhos concentra o maior desvio operacional da rede. O CMV real está 4,8 pontos acima do teórico, com impacto estimado de R$ 11.320 no período. Aproximadamente 74% desse valor está relacionado a carnes, chope e óleo. O problema se intensificou após duas contagens incompletas e três recebimentos com divergência.',
    causasProvaveis: [
      'Porcionamento de carne acima da ficha técnica',
      'Contagens irregulares no estoque refrigerado',
      'Divergências de preço e quantidade em recebimentos',
      'Aumento do preço médio do óleo',
      'Transferência de chope ainda não conciliada',
    ],
    recomendacoes: [
      'Concluir inventário do estoque refrigerado',
      'Revisar porcionamento dos cinco itens com maior desvio',
      'Conferir os recebimentos relacionados',
      'Validar a transferência de chope',
      'Negociar o preço do óleo',
    ],
    indiceOperacional: {
      valor: 62,
      classificacao: 'Crítico',
      composicao: [
        { label: 'Controle de CMV', valor: 48 },
        { label: 'Precisão de estoque', valor: 54 },
        { label: 'Compras e recebimentos', valor: 67 },
        { label: 'Execução de inventários', valor: 42 },
        { label: 'Resolução de pendências', valor: 71 },
        { label: 'Conformidade de fichas técnicas', valor: 80 },
      ],
    },
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.315, cmvReal: 0.324 },
      { semana: 'Sem. 2', cmvTeorico: 0.316, cmvReal: 0.328 },
      { semana: 'Sem. 3', cmvTeorico: 0.318, cmvReal: 0.339 },
      { semana: 'Sem. 4', cmvTeorico: 0.317, cmvReal: 0.342 },
      { semana: 'Sem. 5', cmvTeorico: 0.319, cmvReal: 0.351 },
      { semana: 'Sem. 6', cmvTeorico: 0.32, cmvReal: 0.357 },
      { semana: 'Sem. 7', cmvTeorico: 0.32, cmvReal: 0.363 },
      { semana: 'Sem. 8', cmvTeorico: 0.321, cmvReal: 0.369 },
    ],
    eventosTendencia: [
      { semanaIndex: 2, label: 'Contagem incompleta' },
      { semanaIndex: 4, label: 'Aumento do preço do óleo' },
      { semanaIndex: 5, label: 'Divergência de recebimento' },
      { semanaIndex: 6, label: 'Transferência de chope' },
      { semanaIndex: 7, label: 'Revisão de ficha técnica' },
    ],
    causas: [
      {
        id: 'carnes',
        categoria: 'Carnes',
        impacto: 5680,
        participacao: 0.502,
        confianca: 'alta',
        justificativaConfianca: 'Há concordância entre vendas, fichas técnicas, movimentações e contagem.',
        evidenciasResumo: [
          'Consumo real 12,4% acima do teórico',
          'Três produtos com desvio recorrente',
          'Última contagem do estoque refrigerado incompleta',
          'Perdas registradas abaixo do consumo não explicado',
        ],
        evidencias: [
          {
            dadoObservado: '412 kg consumidos (carnes bovinas)',
            dadoEsperado: '367 kg previstos pela ficha técnica',
            diferenca: '+12,4%',
            origem: 'Ficha técnica × movimentação de estoque',
            data: '2026-07-22',
            responsavel: 'Cozinha — Moinhos',
            confianca: 'alta',
          },
          {
            dadoObservado: 'Contagem do estoque refrigerado incompleta',
            dadoEsperado: 'Contagem semanal completa em todos os itens',
            diferenca: '3 itens não contados',
            origem: 'Inventário',
            data: '2026-07-17',
            responsavel: 'Rafael Martins',
            confianca: 'media',
          },
        ],
      },
      {
        id: 'chope',
        categoria: 'Chope',
        impacto: 2460,
        participacao: 0.217,
        confianca: 'media',
        justificativaConfianca: 'Existe uma movimentação registrada sem confirmação da unidade de destino.',
        evidenciasResumo: [
          'Transferência pendente de conciliação',
          'Diferença entre saída registrada e venda',
          'Risco de inconsistência no estoque de IPA',
        ],
        evidencias: [
          {
            dadoObservado: 'Saída de 2 barris de Chope IPA registrada',
            dadoEsperado: 'Confirmação de recebimento pela unidade de destino',
            diferenca: 'Sem confirmação há 4 dias',
            origem: 'Transferência entre unidades',
            data: '2026-07-19',
            responsavel: 'Estoque — Moinhos',
            confianca: 'media',
          },
        ],
      },
      {
        id: 'oleo',
        categoria: 'Óleo e frituras',
        impacto: 1740,
        participacao: 0.154,
        confianca: 'media',
        justificativaConfianca: 'O consumo está acima do padrão, mas ainda faltam dados de contagem.',
        evidenciasResumo: [
          'Aumento de preço de 9,4%',
          'Frequência de troca acima do padrão',
          'Compra emergencial',
        ],
        evidencias: [
          {
            dadoObservado: 'Preço médio de R$ 9,84/L',
            dadoEsperado: 'Preço médio anterior de R$ 8,99/L',
            diferenca: '+9,4%',
            origem: 'Nota fiscal — Distribuidora Gaúcha',
            data: '2026-07-15',
            responsavel: 'Compras',
            confianca: 'alta',
          },
        ],
      },
      {
        id: 'outros-moinhos',
        categoria: 'Outros',
        impacto: 1440,
        participacao: 0.127,
        confianca: 'baixa',
        justificativaConfianca: 'Diferença residual ainda não decomposta por categoria específica.',
        evidenciasResumo: ['Diferença residual entre consumo teórico e real não atribuída às demais categorias'],
        evidencias: [],
      },
    ],
    produtosCriticos: [
      {
        id: 'burger-costela',
        nome: 'Burger Costela',
        categoria: 'Carnes',
        venda: 48200,
        consumoTeorico: 312,
        consumoReal: 356,
        impacto: 2180,
        tendencia: 'up',
        confianca: 'alta',
        acaoRecomendada: 'Revisar porcionamento com a cozinha',
      },
      {
        id: 'tomahawk',
        nome: 'Tomahawk Burger',
        categoria: 'Carnes',
        venda: 31400,
        consumoTeorico: 156,
        consumoReal: 179,
        impacto: 1640,
        tendencia: 'up',
        confianca: 'alta',
        acaoRecomendada: 'Conferir peso de porcionamento',
      },
      {
        id: 'entrecot',
        nome: 'Porção de Entrecot',
        categoria: 'Carnes',
        venda: 22600,
        consumoTeorico: 98,
        consumoReal: 114,
        impacto: 1180,
        tendencia: 'up',
        confianca: 'media',
        acaoRecomendada: 'Validar contagem do estoque refrigerado',
      },
      {
        id: 'chope-ipa-500',
        nome: 'Chope IPA 500 ml',
        categoria: 'Chope',
        venda: 27800,
        consumoTeorico: 1240,
        consumoReal: 1390,
        impacto: 980,
        tendencia: 'up',
        confianca: 'media',
        acaoRecomendada: 'Conciliar transferência entre unidades',
      },
      {
        id: 'batata-cheddar',
        nome: 'Batata com Cheddar',
        categoria: 'Acompanhamentos',
        venda: 18900,
        consumoTeorico: 890,
        consumoReal: 940,
        impacto: 420,
        tendencia: 'flat',
        confianca: 'baixa',
        acaoRecomendada: 'Monitorar no próximo período',
      },
      {
        id: 'burger-bacon',
        nome: 'Burger Bacon',
        categoria: 'Carnes',
        venda: 26100,
        consumoTeorico: 210,
        consumoReal: 226,
        impacto: 380,
        tendencia: 'flat',
        confianca: 'baixa',
        acaoRecomendada: 'Monitorar no próximo período',
      },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '36,9%', rede: '34,8%', unidadeMelhor: false },
      { metrica: 'Diferença real vs. teórico', unidade: '4,8 p.p.', rede: '2,9 p.p.', unidadeMelhor: false },
      { metrica: 'Perdas sobre vendas', unidade: '2,1%', rede: '1,3%', unidadeMelhor: false },
      { metrica: 'Inventários concluídos no prazo', unidade: '58%', rede: '84%', unidadeMelhor: false },
      { metrica: 'Divergências de recebimento', unidade: '3', rede: '1,2 (média)', unidadeMelhor: false },
    ],
    comparacaoRedeInsight: 'A maior distância em relação à rede está na regularidade dos inventários e no consumo não explicado de carnes.',
    benchmarkInterno: {
      comparadoCom: 'serra',
      comparadoComNome: 'Salvador Serra',
      linhas: [
        { metrica: 'CMV real', moinhos: '36,9%', serra: '31,8%' },
        { metrica: 'Diferença vs. teórico', moinhos: '4,8 p.p.', serra: '0,4 p.p.' },
        { metrica: 'Inventários no prazo', moinhos: '58%', serra: '96%' },
        { metrica: 'Perdas sobre vendas', moinhos: '2,1%', serra: '0,8%' },
        { metrica: 'Divergências de recebimento', moinhos: '3', serra: '0' },
      ],
      insight:
        'Serra realiza contagens do estoque refrigerado em intervalos menores e possui menor diferença entre perda registrada e consumo não explicado.',
    },
    estoque: {
      acuraciadeEstimada: 0.872,
      itensCriticos: 7,
      itensExcesso: 4,
      itensSemMovimentacao: 3,
      transferenciasPendentes: 1,
    },
    compras: {
      pedidosEmAberto: 5,
      comprasEmergenciais: 2,
      divergencias: 3,
      valorDivergencias: 6280,
      principalFornecedorAtencao: 'Serra Alimentos',
      registros: [
        { identificador: 'NF 9821', fornecedor: 'Serra Alimentos', status: 'Divergente', detalhe: 'Diferença de quantidade e de preço', impacto: 1860 },
        { identificador: 'NF 9788', fornecedor: 'Distribuidora Gaúcha', status: 'Aguardando validação', detalhe: 'Aumento de preço de 9,4% no óleo' },
        { identificador: 'Pedido 4532', fornecedor: 'Bebidas Sul', status: 'Recebido parcialmente', detalhe: 'Chope IPA — recebimento parcial' },
      ],
    },
    fornecedores: [
      { nome: 'Serra Alimentos', totalComprado: 38400, variacaoPreco: 0.087, divergenciasRede: 4, divergenciasUnidade: 2, atrasoMedioDias: 1.8, avaliacao: 2.6, status: 'critico' },
      { nome: 'Distribuidora Gaúcha', totalComprado: 21200, variacaoPreco: 0.052, divergenciasRede: 2, divergenciasUnidade: 1, avaliacao: 3.4, status: 'atencao' },
      { nome: 'Bebidas Sul', totalComprado: 18700, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.1, status: 'ok' },
      { nome: 'Hortifruti Bahia', totalComprado: 9800, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.4, status: 'ok' },
      { nome: 'Laticínios do Vale', totalComprado: 4600, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.2, status: 'ok' },
    ],
    acoes: [
      { id: 'moinhos-a1', titulo: 'Revisar porcionamento de carnes', responsavel: 'Chef de cozinha', prazoLabel: 'Amanhã, 10h', prioridade: 'critica', progresso: 25, status: 'em_andamento', origem: 'Alerta do CORTEX', escopo: 'local' },
      { id: 'moinhos-a2', titulo: 'Concluir inventário refrigerado', responsavel: 'Rafael Martins', prazoLabel: 'Hoje, 18h', prioridade: 'critica', status: 'nao_iniciado', origem: 'Alerta do CORTEX', escopo: 'local' },
      { id: 'moinhos-a3', titulo: 'Validar NF 9821', responsavel: 'Recebimento', prazoLabel: 'Atrasada', prioridade: 'alta', status: 'aguardando', origem: 'Divergência de recebimento', escopo: 'local' },
    ],
    atividade: [
      { tipo: 'perda', usuario: 'Rafael Martins', acao: 'registrou perda de carne no estoque refrigerado', horario: '2026-07-22T14:10:00-03:00' },
      { tipo: 'recebimento', usuario: 'CORTEX', acao: 'registrou divergência no recebimento da NF 9821', horario: '2026-07-23T10:40:00-03:00' },
      { tipo: 'contagem', usuario: 'Rafael Martins', acao: 'iniciou a contagem do estoque refrigerado', horario: '2026-07-17T17:10:00-03:00' },
      { tipo: 'ficha_tecnica', usuario: 'Leo', acao: 'solicitou revisão da ficha técnica do Burger Costela', horario: '2026-07-21T09:00:00-03:00' },
      { tipo: 'transferencia', usuario: 'Diego Andrade', acao: 'enviou transferência de Chope IPA para Moinhos', horario: '2026-07-19T16:00:00-03:00' },
      { tipo: 'comentario', usuario: 'Rafael Martins', acao: 'comentou na ação "Concluir inventário refrigerado"', horario: '2026-07-22T18:30:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'Por que Moinhos está crítica?',
        resposta:
          'Moinhos apresenta CMV real de 36,9%, 4,8 pontos acima do teórico e 4,4 pontos acima da meta. O impacto estimado é de R$ 11.320 no período. As principais evidências são: consumo de carnes 12,4% acima do previsto; última contagem refrigerada incompleta; três recebimentos com divergência; transferência de chope ainda não conciliada; e aumento de 9,4% no preço do óleo. Carnes representam aproximadamente 50% do impacto estimado.',
      },
      {
        pergunta: 'Quando o CMV começou a piorar?',
        resposta:
          'A deterioração é gradual e vem se acentuando nas últimas quatro semanas, coincidindo com uma contagem incompleta na semana 3 e a divergência de recebimento na semana 6. O CMV real saiu de 32,4% na semana 1 para 36,9% na semana 8.',
      },
      {
        pergunta: 'Quais produtos explicam a diferença?',
        resposta:
          'Burger Costela, Tomahawk Burger e Porção de Entrecot concentram a maior parte do desvio de carnes — juntos, cerca de R$ 5.000 do impacto estimado. Chope IPA 500 ml também contribui de forma relevante, ligado à transferência ainda não conciliada.',
      },
      {
        pergunta: 'O problema é compra, estoque ou produção?',
        resposta:
          'O desvio parece envolver mais de uma etapa. A maior evidência está na produção e no controle de estoque de carnes. Compras e recebimentos também contribuem, principalmente no óleo e em três notas divergentes. Distribuição estimada do impacto: produção e porcionamento 45%; estoque e inventários 29%; compras e preços 16%; recebimentos e conciliação 10%. Essa distribuição é uma estimativa investigativa e deve ser validada após a próxima contagem.',
      },
      {
        pergunta: 'Quais evidências ainda estão faltando?',
        resposta:
          'Faltam a contagem completa do estoque refrigerado (3 itens não contados na última rodada) e a confirmação de recebimento da transferência de Chope IPA pela unidade de destino. Essas duas pendências limitam a confiança total do diagnóstico de carnes e chope.',
      },
      {
        pergunta: 'O que devo cobrar do gerente hoje?',
        resposta:
          'Recomendo solicitar quatro entregas: conclusão do inventário refrigerado até 18h; conferência dos três produtos com maior consumo não explicado; validação da transferência de chope IPA; e retorno sobre as divergências da NF 9821. Essas ações podem confirmar ou eliminar as principais hipóteses antes do fechamento semanal.',
      },
      {
        pergunta: 'Como Moinhos se compara à Serra?',
        resposta:
          'Moinhos vende mais, porém opera com diferença de CMV significativamente maior. Serra realiza inventários com maior regularidade e apresenta menor consumo não explicado. Principais diferenças: diferença de CMV de 4,8 pontos em Moinhos versus 0,4 em Serra; inventários no prazo de 58% versus 96%; perdas sobre vendas de 2,1% versus 0,8%; divergências de recebimento de 3 versus 0. A rotina de contagem refrigerada de Serra merece ser analisada como referência interna.',
      },
      {
        pergunta: 'Qual ação pode gerar maior impacto?',
        resposta:
          'Concluir o inventário do estoque refrigerado e revisar o porcionamento dos três produtos de carne com maior desvio devem gerar o maior impacto — juntos, respondem por cerca de R$ 5.000 do total estimado de R$ 11.320.',
      },
    ],
  },

  'caxias-centro': {
    unitId: 'caxias-centro',
    resumoExecutivo:
      'Caxias Centro é a segunda unidade mais crítica da rede. O CMV real está 4,3 pontos acima do teórico, com impacto estimado de R$ 7.210 no período. O padrão se assemelha ao de Moinhos: consumo de carnes acima da ficha técnica, agora somado a duas divergências de recebimento com o fornecedor Serra Alimentos ainda sem retorno.',
    recomendacoes: [
      'Revisar porcionamento de carnes junto à cozinha',
      'Cobrar retorno do fornecedor Serra Alimentos sobre as divergências',
      'Comparar perdas registradas com o consumo não explicado',
    ],
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.312, cmvReal: 0.325 },
      { semana: 'Sem. 2', cmvTeorico: 0.313, cmvReal: 0.329 },
      { semana: 'Sem. 3', cmvTeorico: 0.315, cmvReal: 0.334 },
      { semana: 'Sem. 4', cmvTeorico: 0.315, cmvReal: 0.339 },
      { semana: 'Sem. 5', cmvTeorico: 0.316, cmvReal: 0.345 },
      { semana: 'Sem. 6', cmvTeorico: 0.317, cmvReal: 0.35 },
      { semana: 'Sem. 7', cmvTeorico: 0.318, cmvReal: 0.356 },
      { semana: 'Sem. 8', cmvTeorico: 0.318, cmvReal: 0.361 },
    ],
    produtosCriticos: [
      { id: 'cc-costela', nome: 'Burger Costela', categoria: 'Carnes', venda: 24100, consumoTeorico: 168, consumoReal: 191, impacto: 1340, tendencia: 'up', confianca: 'alta', acaoRecomendada: 'Revisar porcionamento com a cozinha' },
      { id: 'cc-tomahawk', nome: 'Tomahawk Burger', categoria: 'Carnes', venda: 16800, consumoTeorico: 82, consumoReal: 95, impacto: 980, tendencia: 'up', confianca: 'media', acaoRecomendada: 'Conferir peso de porcionamento' },
      { id: 'cc-bacon', nome: 'Burger Bacon', categoria: 'Carnes', venda: 14200, consumoTeorico: 110, consumoReal: 121, impacto: 460, tendencia: 'flat', confianca: 'baixa', acaoRecomendada: 'Monitorar no próximo período' },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '36,1%', rede: '34,8%', unidadeMelhor: false },
      { metrica: 'Diferença real vs. teórico', unidade: '4,3 p.p.', rede: '2,9 p.p.', unidadeMelhor: false },
      { metrica: 'Divergências de recebimento', unidade: '2', rede: '1,2 (média)', unidadeMelhor: false },
    ],
    comparacaoRedeInsight: 'O consumo de carnes segue o mesmo padrão de Moinhos; as divergências de recebimento com Serra Alimentos ainda não têm retorno.',
    estoque: { acuraciadeEstimada: 0.891, itensCriticos: 4, itensExcesso: 2, itensSemMovimentacao: 1, transferenciasPendentes: 0 },
    compras: {
      pedidosEmAberto: 3,
      comprasEmergenciais: 1,
      divergencias: 2,
      valorDivergencias: 3780,
      principalFornecedorAtencao: 'Serra Alimentos',
      registros: [
        { identificador: 'NF 9814', fornecedor: 'Serra Alimentos', status: 'Divergente', detalhe: 'Diferença de quantidade em carnes', impacto: 2100 },
        { identificador: 'NF 9809', fornecedor: 'Serra Alimentos', status: 'Divergente', detalhe: 'Diferença de preço', impacto: 1680 },
      ],
    },
    fornecedores: [
      { nome: 'Serra Alimentos', totalComprado: 22600, variacaoPreco: 0.087, divergenciasRede: 4, divergenciasUnidade: 2, atrasoMedioDias: 1.8, avaliacao: 2.6, status: 'critico' },
      { nome: 'Hortifruti Bahia', totalComprado: 8100, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.3, status: 'ok' },
    ],
    acoes: [
      { id: 'cc-a1', titulo: 'Cobrar retorno da Serra Alimentos', responsavel: 'Compras', prazoLabel: 'Atrasada', prioridade: 'alta', status: 'aguardando', origem: 'Divergência de recebimento', escopo: 'local' },
    ],
    atividade: [
      { tipo: 'recebimento', usuario: 'CORTEX', acao: 'registrou divergência no recebimento da NF 9814', horario: '2026-07-22T11:20:00-03:00' },
      { tipo: 'perda', usuario: 'Juliana Prado', acao: 'registrou perda de carne no estoque', horario: '2026-07-21T15:40:00-03:00' },
      { tipo: 'contagem', usuario: 'Juliana Prado', acao: 'concluiu a contagem semanal', horario: '2026-07-19T18:00:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'Por que Caxias Centro está crítica?',
        resposta:
          'O CMV real está em 36,1%, 4,3 pontos acima do teórico, com impacto estimado de R$ 7.210. O padrão é semelhante ao de Moinhos: consumo de carnes acima da ficha técnica, somado a duas divergências de recebimento com a Serra Alimentos ainda sem retorno.',
      },
      {
        pergunta: 'Como Caxias Centro se compara a Moinhos?',
        resposta:
          'As duas unidades compartilham a mesma causa principal — consumo de carnes acima do previsto — mas Moinhos tem impacto financeiro quase o dobro e mais uma frente de causa (chope e óleo). Caxias Centro está mais concentrada em carnes e recebimentos.',
      },
    ],
  },

  'zona-norte': {
    unitId: 'zona-norte',
    resumoExecutivo:
      'Zona Norte está em atenção, mas com sinal positivo: o CMV real vem melhorando nas últimas semanas (de 35,2% para 34,2%). O ponto de atenção principal não é o CMV, e sim o risco de ruptura de chope IPA, que cobre apenas 1,7 dia de operação.',
    recomendacoes: [
      'Avaliar transferência de chope IPA entre unidades',
      'Manter o acompanhamento da melhora de CMV das últimas semanas',
    ],
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.321, cmvReal: 0.352 },
      { semana: 'Sem. 2', cmvTeorico: 0.321, cmvReal: 0.348 },
      { semana: 'Sem. 3', cmvTeorico: 0.32, cmvReal: 0.344 },
      { semana: 'Sem. 4', cmvTeorico: 0.32, cmvReal: 0.347 },
      { semana: 'Sem. 5', cmvTeorico: 0.32, cmvReal: 0.343 },
      { semana: 'Sem. 6', cmvTeorico: 0.32, cmvReal: 0.339 },
      { semana: 'Sem. 7', cmvTeorico: 0.32, cmvReal: 0.34 },
      { semana: 'Sem. 8', cmvTeorico: 0.32, cmvReal: 0.342 },
    ],
    produtosCriticos: [
      { id: 'zn-chope-ipa', nome: 'Chope IPA 500 ml', categoria: 'Chope', venda: 19400, consumoTeorico: 980, consumoReal: 1050, impacto: 620, tendencia: 'up', confianca: 'media', acaoRecomendada: 'Avaliar transferência entre unidades' },
      { id: 'zn-batata', nome: 'Batata com Cheddar', categoria: 'Acompanhamentos', venda: 12100, consumoTeorico: 540, consumoReal: 560, impacto: 180, tendencia: 'flat', confianca: 'baixa', acaoRecomendada: 'Monitorar no próximo período' },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '34,2%', rede: '34,8%', unidadeMelhor: true },
      { metrica: 'Diferença real vs. teórico', unidade: '2,2 p.p.', rede: '2,9 p.p.', unidadeMelhor: true },
      { metrica: 'Cobertura de estoque — Chope IPA', unidade: '1,7 dia', rede: '4,2 dias (média)', unidadeMelhor: false },
    ],
    comparacaoRedeInsight: 'O CMV de Zona Norte já está melhor que a média da rede; o ponto de atenção real é o risco de ruptura de chope IPA.',
    estoque: { acuraciadeEstimada: 0.918, itensCriticos: 2, itensExcesso: 3, itensSemMovimentacao: 2, transferenciasPendentes: 1 },
    compras: { pedidosEmAberto: 2, comprasEmergenciais: 0, divergencias: 0, valorDivergencias: 0, principalFornecedorAtencao: '—', registros: [] },
    fornecedores: [
      { nome: 'Bebidas Sul', totalComprado: 14600, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.0, status: 'ok' },
    ],
    acoes: [
      { id: 'zn-a1', titulo: 'Avaliar transferência de Chope IPA', responsavel: 'Patrícia Lins', prazoLabel: 'Hoje', prioridade: 'media', status: 'em_andamento', progresso: 40, origem: 'Alerta do CORTEX', escopo: 'local' },
    ],
    atividade: [
      { tipo: 'estoque', usuario: 'Patrícia Lins', acao: 'sinalizou risco de ruptura de chope IPA', horario: '2026-07-23T08:30:00-03:00' },
      { tipo: 'contagem', usuario: 'Patrícia Lins', acao: 'concluiu a contagem semanal', horario: '2026-07-21T18:00:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'Zona Norte está melhorando ou piorando?',
        resposta:
          'Melhorando. O CMV real caiu de 35,2% para 34,2% nas últimas semanas, já abaixo da média da rede (34,8%). O ponto de atenção agora é o estoque de chope IPA, que cobre apenas 1,7 dia de operação.',
      },
      {
        pergunta: 'Existe risco de ruptura?',
        resposta:
          'Sim, no chope IPA. A cobertura atual é de 1,7 dia, bem abaixo da média da rede de 4,2 dias. Recomenda-se avaliar uma transferência entre unidades ainda hoje.',
      },
    ],
  },

  'cidade-baixa': {
    unitId: 'cidade-baixa',
    resumoExecutivo:
      'Cidade Baixa está em atenção moderada, com CMV real 1,9 ponto acima do teórico — a menor diferença entre as unidades em atenção. O maior ponto de melhoria não é o CMV, e sim o excesso de estoque em 6 itens, o que imobiliza capital sem gerar risco imediato de ruptura.',
    recomendacoes: [
      'Revisar o giro dos itens em excesso de estoque',
      'Manter o acompanhamento do bom desempenho de fornecedores',
    ],
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.316, cmvReal: 0.319 },
      { semana: 'Sem. 2', cmvTeorico: 0.316, cmvReal: 0.321 },
      { semana: 'Sem. 3', cmvTeorico: 0.317, cmvReal: 0.324 },
      { semana: 'Sem. 4', cmvTeorico: 0.317, cmvReal: 0.327 },
      { semana: 'Sem. 5', cmvTeorico: 0.317, cmvReal: 0.33 },
      { semana: 'Sem. 6', cmvTeorico: 0.317, cmvReal: 0.332 },
      { semana: 'Sem. 7', cmvTeorico: 0.317, cmvReal: 0.334 },
      { semana: 'Sem. 8', cmvTeorico: 0.317, cmvReal: 0.336 },
    ],
    produtosCriticos: [
      { id: 'cb-entrecot', nome: 'Porção de Entrecot', categoria: 'Carnes', venda: 21400, consumoTeorico: 96, consumoReal: 104, impacto: 560, tendencia: 'up', confianca: 'media', acaoRecomendada: 'Monitorar porcionamento' },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '33,6%', rede: '34,8%', unidadeMelhor: true },
      { metrica: 'Diferença real vs. teórico', unidade: '1,9 p.p.', rede: '2,9 p.p.', unidadeMelhor: true },
      { metrica: 'Itens em excesso de estoque', unidade: '6', rede: '3,2 (média)', unidadeMelhor: false },
    ],
    comparacaoRedeInsight: 'Cidade Baixa opera com CMV melhor que a rede; o ponto de melhoria é reduzir o estoque excedente.',
    estoque: { acuraciadeEstimada: 0.905, itensCriticos: 2, itensExcesso: 6, itensSemMovimentacao: 4, transferenciasPendentes: 0 },
    compras: { pedidosEmAberto: 2, comprasEmergenciais: 0, divergencias: 1, valorDivergencias: 640, principalFornecedorAtencao: '—', registros: [] },
    fornecedores: [
      { nome: 'Distribuidora Gaúcha', totalComprado: 26200, variacaoPreco: 0.052, divergenciasRede: 2, divergenciasUnidade: 1, avaliacao: 3.8, status: 'atencao' },
      { nome: 'Hortifruti Bahia', totalComprado: 15400, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.5, status: 'ok' },
    ],
    acoes: [
      { id: 'cbx-a1', titulo: 'Aprovar compra pendente — R$ 8.420', responsavel: 'Leo', prazoLabel: 'Esta semana', prioridade: 'media', status: 'aguardando', origem: 'Aprovação de compra', escopo: 'local' },
    ],
    atividade: [
      { tipo: 'transferencia', usuario: 'Diego Andrade', acao: 'transferiu chope entre unidades', horario: '2026-07-22T15:30:00-03:00' },
      { tipo: 'compra', usuario: 'Leo', acao: 'aprovou um pedido de compra', horario: '2026-07-23T11:05:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'Por que Cidade Baixa está em atenção?',
        resposta:
          'A diferença de CMV é a menor entre as unidades em atenção (1,9 ponto) e já está abaixo da média da rede. O motivo da atenção é o excesso de estoque em 6 itens, que imobiliza capital sem risco imediato de ruptura.',
      },
    ],
  },

  serra: {
    unitId: 'serra',
    resumoExecutivo:
      'Serra é a unidade mais saudável da rede: opera apenas 0,4 ponto acima do CMV teórico, mantém os inventários em dia (96% no prazo) e concentra apenas um alerta de baixa prioridade. A regularidade das contagens do estoque refrigerado é apontada como referência interna para as demais unidades.',
    recomendacoes: [
      'Documentar a rotina de contagem do estoque refrigerado como referência interna',
      'Manter o acompanhamento do único alerta de baixa prioridade',
    ],
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.313, cmvReal: 0.323 },
      { semana: 'Sem. 2', cmvTeorico: 0.313, cmvReal: 0.321 },
      { semana: 'Sem. 3', cmvTeorico: 0.313, cmvReal: 0.32 },
      { semana: 'Sem. 4', cmvTeorico: 0.314, cmvReal: 0.319 },
      { semana: 'Sem. 5', cmvTeorico: 0.314, cmvReal: 0.319 },
      { semana: 'Sem. 6', cmvTeorico: 0.314, cmvReal: 0.318 },
      { semana: 'Sem. 7', cmvTeorico: 0.314, cmvReal: 0.318 },
      { semana: 'Sem. 8', cmvTeorico: 0.314, cmvReal: 0.318 },
    ],
    produtosCriticos: [
      { id: 'srr-item', nome: 'Chope Pilsen 500 ml', categoria: 'Chope', venda: 16200, consumoTeorico: 780, consumoReal: 796, impacto: 120, tendencia: 'flat', confianca: 'baixa', acaoRecomendada: 'Monitorar no próximo período' },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '31,8%', rede: '34,8%', unidadeMelhor: true },
      { metrica: 'Diferença real vs. teórico', unidade: '0,4 p.p.', rede: '2,9 p.p.', unidadeMelhor: true },
      { metrica: 'Inventários no prazo', unidade: '96%', rede: '84%', unidadeMelhor: true },
    ],
    comparacaoRedeInsight: 'Serra opera consistentemente melhor que a média da rede em todos os indicadores — candidata natural a referência interna.',
    estoque: { acuraciadeEstimada: 0.964, itensCriticos: 1, itensExcesso: 2, itensSemMovimentacao: 1, transferenciasPendentes: 0 },
    compras: { pedidosEmAberto: 1, comprasEmergenciais: 0, divergencias: 0, valorDivergencias: 0, principalFornecedorAtencao: '—', registros: [] },
    fornecedores: [
      { nome: 'Hortifruti Bahia', totalComprado: 11200, divergenciasRede: 0, divergenciasUnidade: 0, avaliacao: 4.6, status: 'ok' },
    ],
    acoes: [],
    atividade: [
      { tipo: 'contagem', usuario: 'Rafael Nunes', acao: 'concluiu a contagem de estoque', horario: '2026-07-23T12:20:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'O que torna Serra uma referência interna?',
        resposta:
          'A combinação de inventários regulares (96% no prazo, o melhor da rede), baixa diferença de CMV (0,4 ponto) e o menor índice de perdas sobre vendas (0,8%). A rotina de contagem do estoque refrigerado é o principal processo a ser replicado.',
      },
    ],
  },

  'caxias-norte': {
    unitId: 'caxias-norte',
    resumoExecutivo:
      'Não é possível concluir a causa principal do desvio em Caxias Norte antes da finalização do inventário semanal, pendente há 7 dias. Os dados disponíveis indicam CMV real 1,6 ponto acima do teórico, mas a confiabilidade do diagnóstico é limitada até a contagem ser concluída.',
    recomendacoes: [
      'Concluir o inventário semanal pendente',
      'Reavaliar as causas do desvio após a contagem',
    ],
    tendenciaSemanal: [
      { semana: 'Sem. 1', cmvTeorico: 0.322, cmvReal: 0.32 },
      { semana: 'Sem. 2', cmvTeorico: 0.322, cmvReal: 0.323 },
      { semana: 'Sem. 3', cmvTeorico: 0.322, cmvReal: 0.327 },
      { semana: 'Sem. 4', cmvTeorico: 0.323, cmvReal: 0.33 },
      { semana: 'Sem. 5', cmvTeorico: 0.323, cmvReal: 0.333 },
      { semana: 'Sem. 6', cmvTeorico: 0.323, cmvReal: 0.335 },
      { semana: 'Sem. 7', cmvTeorico: 0.323, cmvReal: 0.337 },
      { semana: 'Sem. 8', cmvTeorico: 0.323, cmvReal: 0.339 },
    ],
    produtosCriticos: [
      { id: 'cn-item', nome: 'Burger Bacon', categoria: 'Carnes', venda: 9800, consumoTeorico: 84, consumoReal: 93, impacto: 340, tendencia: 'up', confianca: 'baixa', acaoRecomendada: 'Aguardar conclusão do inventário' },
    ],
    comparacaoRede: [
      { metrica: 'CMV real', unidade: '33,9%', rede: '34,8%', unidadeMelhor: true },
      { metrica: 'Diferença real vs. teórico', unidade: '1,6 p.p.', rede: '2,9 p.p.', unidadeMelhor: true },
      { metrica: 'Inventário em dia', unidade: 'Não', rede: '84% das unidades em dia', unidadeMelhor: false },
    ],
    comparacaoRedeInsight: 'A comparação com a rede tem confiabilidade reduzida até a conclusão do inventário semanal.',
    estoque: { acuraciadeEstimada: 0.68, itensCriticos: 3, itensExcesso: 2, itensSemMovimentacao: 2, transferenciasPendentes: 0 },
    compras: { pedidosEmAberto: 2, comprasEmergenciais: 0, divergencias: 1, valorDivergencias: 890, principalFornecedorAtencao: 'Serra Alimentos', registros: [] },
    fornecedores: [
      { nome: 'Serra Alimentos', totalComprado: 9200, variacaoPreco: 0.087, divergenciasRede: 4, divergenciasUnidade: 1, atrasoMedioDias: 1.8, avaliacao: 2.6, status: 'critico' },
    ],
    acoes: [
      { id: 'cxn-a1', titulo: 'Concluir inventário semanal', responsavel: 'Bruno Teles', prazoLabel: 'Hoje, 18h', prioridade: 'alta', status: 'nao_iniciado', origem: 'Alerta do CORTEX', escopo: 'local' },
    ],
    atividade: [
      { tipo: 'alerta', usuario: 'CORTEX', acao: 'sinalizou inventário semanal pendente há 7 dias', horario: '2026-07-23T07:00:00-03:00' },
    ],
    perguntasRapidas: [
      {
        pergunta: 'Por que não há um diagnóstico definitivo para Caxias Norte?',
        resposta:
          'O inventário semanal está pendente há 7 dias, o que reduz a confiabilidade de qualquer causa proposta para o desvio de CMV. Os dados de vendas e compras estão disponíveis, mas sem a contagem física não é possível confirmar consumo real por categoria.',
      },
    ],
    dadosIncompletos: {
      mensagem: 'Não é possível concluir a causa principal do desvio antes da finalização do inventário semanal.',
      dadosDisponiveis: ['Vendas do período', 'Compras e recebimentos', 'Fichas técnicas', 'CMV teórico calculado'],
      dadosFaltantes: ['Contagem física do estoque geral', 'Confirmação de consumo real por categoria'],
      impacto: 'O CMV real informado (33,9%) pode estar sub ou superestimado até a conferência física.',
      acaoNecessaria: 'Concluir o inventário semanal',
      prazoLabel: 'Hoje, 18h',
      responsavel: 'Bruno Teles',
    },
  },
}
