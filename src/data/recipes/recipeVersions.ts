import type { RecipeVersion } from '@/types'

const aprovacaoPadrao = [
  { ordem: 1, papel: 'Chef Executivo', responsavel: 'Chef Executivo', status: 'aprovado' as const, data: '2026-06-10T10:00:00-03:00' },
  { ordem: 2, papel: 'Operações', responsavel: 'Leo', status: 'aprovado' as const, data: '2026-06-11T10:00:00-03:00' },
  { ordem: 3, papel: 'Financeiro', responsavel: 'Financeiro', status: 'pendente' as const },
]

/**
 * Burger Costela — versão vigente 3.2 (seção 22-23 do briefing). Os
 * oito ingredientes somam exatamente R$ 15,70. A versão 3.1 permite a
 * comparação: bacon 40g→35g, cheddar 35g→40g, custo da carne atualizado
 * — custo por porção subiu R$ 0,62 (seção 51).
 */
const burgerCostelaV32: RecipeVersion = {
  id: 'burger-costela-v3.2',
  recipeId: 'burger-costela',
  versao: '3.2',
  status: 'publicada',
  criadoPor: 'Chef Executivo',
  criadoEm: '2026-06-12T10:00:00-03:00',
  vigenciaInicio: '2026-06-12T10:00:00-03:00',
  unidadesAplicaveis: ['todas'],
  precoVenda: 48.9,
  descontoMedioPercentual: 0,
  custoEmbalagem: 0,
  ingredientes: [
    { id: 'blend-carne', nome: 'Blend de carne bovina', tipo: 'insumo', quantidadeBruta: 183.7, quantidadeLiquida: 180, unidade: 'g', fatorCorrecao: 1.0204, perdaPercentual: 0.02, custoUnitario: 0.03278, custoNaFicha: 5.9, ultimaAtualizacao: '2026-06-12T10:00:00-03:00', confianca: 'alta' },
    { id: 'pao-brioche', nome: 'Pão brioche', tipo: 'insumo', quantidadeBruta: 1, quantidadeLiquida: 1, unidade: 'unidade', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 2.1, custoNaFicha: 2.1, ultimaAtualizacao: '2026-05-20T10:00:00-03:00', confianca: 'alta' },
    { id: 'queijo-cheddar', nome: 'Queijo cheddar', tipo: 'insumo', quantidadeBruta: 40, quantidadeLiquida: 40, unidade: 'g', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.037, custoNaFicha: 1.48, ultimaAtualizacao: '2026-06-01T10:00:00-03:00', confianca: 'alta' },
    { id: 'bacon', nome: 'Bacon', tipo: 'insumo', quantidadeBruta: 35, quantidadeLiquida: 35, unidade: 'g', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.0549, custoNaFicha: 1.92, ultimaAtualizacao: '2026-06-01T10:00:00-03:00', confianca: 'alta' },
    { id: 'molho-casa', nome: 'Molho da casa', tipo: 'sub_receita', quantidadeBruta: 25, quantidadeLiquida: 25, unidade: 'g', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.0344, custoNaFicha: 0.86, subReceitaId: 'molho-da-casa', ultimaAtualizacao: '2026-05-15T10:00:00-03:00', confianca: 'alta' },
    { id: 'cebola-caramelizada', nome: 'Cebola caramelizada', tipo: 'sub_receita', quantidadeBruta: 30, quantidadeLiquida: 30, unidade: 'g', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.02467, custoNaFicha: 0.74, subReceitaId: 'cebola-caramelizada', ultimaAtualizacao: '2026-05-15T10:00:00-03:00', confianca: 'media' },
    { id: 'acompanhamento-batata', nome: 'Acompanhamento de batata', tipo: 'sub_receita', quantidadeBruta: 160, quantidadeLiquida: 160, unidade: 'g', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.013125, custoNaFicha: 2.1, ultimaAtualizacao: '2026-05-20T10:00:00-03:00', confianca: 'alta' },
    { id: 'embalagem', nome: 'Embalagem ou material de serviço', tipo: 'embalagem', quantidadeBruta: 1, quantidadeLiquida: 1, unidade: 'unidade', fatorCorrecao: 1, perdaPercentual: 0, custoUnitario: 0.6, custoNaFicha: 0.6, ultimaAtualizacao: '2026-04-01T10:00:00-03:00', confianca: 'alta' },
  ],
  rendimento: { pesoBrutoG: 205, pesoLiquidoG: 195, porcoes: 1, pesoPorcaoG: 195, unidadeRendimento: 'porcoes', perdaTecnicaPercentual: 0.02 },
  preparo: [
    { ordem: 1, instrucao: 'Temperar e selar o blend de carne bovina', tempoMinutos: 4, temperaturaC: 220, equipamento: 'Chapa', pontoControle: 'Ponto ao gosto do cliente' },
    { ordem: 2, instrucao: 'Tostar o pão brioche na chapa', tempoMinutos: 1, equipamento: 'Chapa' },
    { ordem: 3, instrucao: 'Derreter o cheddar sobre o blend', tempoMinutos: 1, temperaturaC: 180 },
    { ordem: 4, instrucao: 'Montar com bacon, molho da casa e cebola caramelizada', pontoControle: 'Seguir ordem de montagem padrão' },
    { ordem: 5, instrucao: 'Finalizar com acompanhamento de batata e embalar', pontoControle: 'Peso final conferido' },
  ],
  pontosCriticos: [
    { label: 'Porção de carne', valor: '180 g ± 5 g' },
    { label: 'Queijo cheddar', valor: '40 g ± 3 g' },
    { label: 'Temperatura de cocção', valor: '≥ 70 °C no centro' },
    { label: 'Tempo de montagem', valor: '≤ 90 segundos' },
  ],
  aprovacoes: aprovacaoPadrao,
  changeSummary: ['Bacon reduzido de 40 g para 35 g', 'Cheddar aumentado de 35 g para 40 g', 'Custo da carne atualizado'],
  loteDePreparoExemplo: { ingredienteNome: 'Blend de carne bovina', pesoBrutoG: 10000, pesoLiquidoG: 9200, porcoesRendidas: 51, pesoPorcaoG: 180, perdaTecnicaPercentual: 0.08 },
}

const burgerCostelaV31: RecipeVersion = {
  ...burgerCostelaV32,
  id: 'burger-costela-v3.1',
  versao: '3.1',
  status: 'substituida',
  criadoEm: '2026-04-28T10:00:00-03:00',
  vigenciaInicio: '2026-04-28T10:00:00-03:00',
  vigenciaFim: '2026-06-12T10:00:00-03:00',
  ingredientes: [
    { ...burgerCostelaV32.ingredientes[0], custoUnitario: 0.02878, custoNaFicha: 5.18 },
    burgerCostelaV32.ingredientes[1],
    { ...burgerCostelaV32.ingredientes[2], quantidadeBruta: 35, quantidadeLiquida: 35, custoNaFicha: 1.3 },
    { ...burgerCostelaV32.ingredientes[3], quantidadeBruta: 40, quantidadeLiquida: 40, custoNaFicha: 2.2 },
    burgerCostelaV32.ingredientes[4],
    burgerCostelaV32.ingredientes[5],
    burgerCostelaV32.ingredientes[6],
    burgerCostelaV32.ingredientes[7],
  ],
  changeSummary: undefined,
  loteDePreparoExemplo: undefined,
}

function simpleVersion(params: {
  id: string
  recipeId: string
  versao: string
  precoVenda: number
  custoPorcao: number
  ultimaAtualizacaoIso: string
  criadoEm: string
  status?: RecipeVersion['status']
}): RecipeVersion {
  return {
    id: params.id,
    recipeId: params.recipeId,
    versao: params.versao,
    status: params.status ?? 'publicada',
    criadoPor: 'Chef Executivo',
    criadoEm: params.criadoEm,
    vigenciaInicio: params.criadoEm,
    unidadesAplicaveis: ['todas'],
    precoVenda: params.precoVenda,
    descontoMedioPercentual: 0,
    custoEmbalagem: 0,
    ingredientes: [
      {
        id: `${params.id}-principal`,
        nome: 'Insumos principais',
        tipo: 'insumo',
        quantidadeBruta: 1,
        quantidadeLiquida: 1,
        unidade: 'porção',
        fatorCorrecao: 1,
        perdaPercentual: 0,
        custoUnitario: params.custoPorcao,
        custoNaFicha: params.custoPorcao,
        ultimaAtualizacao: params.ultimaAtualizacaoIso,
        confianca: 'alta',
      },
    ],
    rendimento: { pesoBrutoG: 0, pesoLiquidoG: 0, porcoes: 1, pesoPorcaoG: 0, unidadeRendimento: 'porcoes', perdaTecnicaPercentual: 0 },
    preparo: [],
    pontosCriticos: [],
    aprovacoes: aprovacaoPadrao,
  }
}

export const recipeVersions: RecipeVersion[] = [
  burgerCostelaV32,
  burgerCostelaV31,
  simpleVersion({ id: 'tomahawk-burger-v2.0', recipeId: 'tomahawk-burger', versao: '2.0', precoVenda: 68.9, custoPorcao: 22.8, criadoEm: '2026-05-03T10:00:00-03:00', ultimaAtualizacaoIso: '2026-05-03T10:00:00-03:00' }),
  simpleVersion({ id: 'burger-bacon-v2.0', recipeId: 'burger-bacon', versao: '2.0', precoVenda: 39.9, custoPorcao: 13.1, criadoEm: '2026-05-03T10:00:00-03:00', ultimaAtualizacaoIso: '2026-05-03T10:00:00-03:00' }),
  simpleVersion({ id: 'burger-classico-v3.0', recipeId: 'burger-classico', versao: '3.0', precoVenda: 32.9, custoPorcao: 10.2, criadoEm: '2026-06-12T10:00:00-03:00', ultimaAtualizacaoIso: '2026-06-12T10:00:00-03:00' }),
  simpleVersion({ id: 'burger-duplo-v1.0', recipeId: 'burger-duplo', versao: '1.0', precoVenda: 44.9, custoPorcao: 15.8, criadoEm: '2026-04-10T10:00:00-03:00', ultimaAtualizacaoIso: '2026-04-10T10:00:00-03:00' }),
  simpleVersion({ id: 'porcao-entrecot-v2.0', recipeId: 'porcao-entrecot', versao: '2.0', precoVenda: 76.9, custoPorcao: 24.6, criadoEm: '2026-05-03T10:00:00-03:00', ultimaAtualizacaoIso: '2026-05-03T10:00:00-03:00' }),
  simpleVersion({ id: 'batata-cheddar-v1.0', recipeId: 'batata-cheddar', versao: '1.0', precoVenda: 34.9, custoPorcao: 11.2, criadoEm: '2026-01-22T10:00:00-03:00', ultimaAtualizacaoIso: '2026-01-22T10:00:00-03:00' }),
  simpleVersion({ id: 'porcao-onion-rings-v1.0', recipeId: 'porcao-onion-rings', versao: '1.0', precoVenda: 28.9, custoPorcao: 8.1, criadoEm: '2026-04-18T10:00:00-03:00', ultimaAtualizacaoIso: '2026-04-18T10:00:00-03:00' }),
  simpleVersion({ id: 'costelinha-suina-v1.0', recipeId: 'costelinha-suina', versao: '1.0', precoVenda: 62.9, custoPorcao: 19.5, criadoEm: '2026-04-02T10:00:00-03:00', ultimaAtualizacaoIso: '2026-04-02T10:00:00-03:00' }),
  simpleVersion({ id: 'chope-ipa-500-v1.0', recipeId: 'chope-ipa-500', versao: '1.0', precoVenda: 22.9, custoPorcao: 6.9, criadoEm: '2026-02-10T10:00:00-03:00', ultimaAtualizacaoIso: '2026-02-10T10:00:00-03:00' }),
  simpleVersion({ id: 'chope-pilsen-500-v1.0', recipeId: 'chope-pilsen-500', versao: '1.0', precoVenda: 18.9, custoPorcao: 5.3, criadoEm: '2026-02-10T10:00:00-03:00', ultimaAtualizacaoIso: '2026-02-10T10:00:00-03:00' }),
  simpleVersion({ id: 'refrigerante-cola-350-v1.0', recipeId: 'refrigerante-cola-350', versao: '1.0', precoVenda: 9.9, custoPorcao: 2.1, criadoEm: '2026-01-15T10:00:00-03:00', ultimaAtualizacaoIso: '2026-01-15T10:00:00-03:00' }),
  simpleVersion({ id: 'sobremesa-especial-v1.0', recipeId: 'sobremesa-especial', versao: '1.0', precoVenda: 26.9, custoPorcao: 7.8, criadoEm: '2026-03-20T10:00:00-03:00', ultimaAtualizacaoIso: '2026-03-20T10:00:00-03:00' }),
  simpleVersion({ id: 'molho-barbecue-individual-v1.0', recipeId: 'molho-barbecue-individual', versao: '1.0', precoVenda: 6.9, custoPorcao: 1.6, criadoEm: '2026-03-05T10:00:00-03:00', ultimaAtualizacaoIso: '2026-03-05T10:00:00-03:00' }),
  simpleVersion({ id: 'combo-costela-chope-v1.0', recipeId: 'combo-costela-chope', versao: '1.0', precoVenda: 64.9, custoPorcao: 21.5, criadoEm: '2026-04-25T10:00:00-03:00', ultimaAtualizacaoIso: '2026-04-25T10:00:00-03:00' }),
]

export function getRecipeVersionById(id: string): RecipeVersion | undefined {
  return recipeVersions.find((v) => v.id === id)
}

export function getRecipeVersionsByRecipe(recipeId: string): RecipeVersion[] {
  return recipeVersions.filter((v) => v.recipeId === recipeId).sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime())
}
