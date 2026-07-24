# CORTEX HOST — Protótipo comercial navegável

Plataforma de inteligência operacional para restaurantes, bares, cervejarias e
redes gastronômicas multiunidade. Este repositório contém a **fundação visual
e estrutural** do produto: design system, shell da aplicação, navegação e
telas-base, com dados simulados — sem backend.

Cliente-piloto de referência: **Salvador Brewing Co.** (6 unidades).

## Como rodar

Pré-requisitos: Node.js 18+ e npm.

```bash
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173`. A tela de login não valida
credenciais reais — use o botão "Usar acesso de demonstração" ou o
usuário abaixo:

- **E-mail:** `leo@salvadorbrewing.com.br`
- **Senha:** `salvador123`

## O que já está construído nesta etapa

- Login, shell principal (sidebar + header), navegação completa (desktop,
  tablet e mobile) e painel lateral do Assistente CORTEX.
- Design system em `src/components/ui` (Button, MetricCard, StatusBadge,
  Modal, Drawer, Table, Tabs, Sparkline, SegmentedControl etc.), com tokens
  centralizados em `tailwind.config.ts` e `src/styles/index.css`.
- **Central de Operações completa e aprofundada** (`src/pages/CentralOperacoes.tsx`
  e `src/pages/central-operacoes/*`): cabeçalho contextual com status de
  integrações, resumo executivo do CORTEX, 6 indicadores clicáveis com
  detalhamento por unidade, ocorrências prioritárias com filtros e criação
  de ações (persistida em localStorage), gráfico de CMV teórico vs. real
  (8 semanas, com meta e seleção por unidade), unidades em cards ou tabela
  comparativa ordenável, impacto financeiro por categoria, compras e
  fornecedores, pendências operacionais filtráveis, atividade recente e
  perguntas rápidas para o CORTEX com respostas simuladas coerentes.
- Telas estruturais para os demais módulos (Unidades, CMV, Estoque, Compras,
  Recebimentos, Fornecedores, Fichas Técnicas, Biblioteca, Assistente CORTEX,
  Configurações), com filtros básicos, skeletons e aviso de "módulo em
  construção" — prontas para receber a lógica definitiva em etapas futuras.
- Dados simulados centralizados em `src/data`, com valores fixos (não
  aleatórios) para manter consistência entre todas as telas.

## O que ainda NÃO está implementado (propositalmente)

Cálculos definitivos de CMV, lógica de estoque/compras/recebimento, OCR real
de notas fiscais e a experiência conversacional completa do Assistente CORTEX
serão desenvolvidos em etapas dedicadas e específicas do protótipo.

## Observação importante sobre os dados

Os nomes das seis unidades (Salvador Moinhos, Cidade Baixa, Zona Norte, Serra,
Caxias Centro, Caxias Norte) em `src/data/units.ts` são **demonstrativos** e
devem ser substituídos pelos nomes reais das unidades da Salvador Brewing Co.
após validação com o cliente.

## Estrutura de pastas

```
src/
  components/
    ui/            componentes de design system (Button, Card, Modal, Table...)
    layout/        Sidebar, Header, AppShell, MobileNavDrawer
    navigation/    configuração e itens do menu principal
    data-display/  UnitStatusCard, CmvTrendChart
    cortex/        CortexMark, CortexButton, AIInsightCard, CortexPanel
  pages/           uma página por item de menu
  data/            dados simulados centralizados
  types/           tipos TypeScript compartilhados
  hooks/           hooks utilitários (disclosure, click-outside, escape)
  context/         estado global (período, unidade, painéis, sessão simulada)
  routes/          proteção de rota simulada
  utils/           formatação (moeda, percentual, datas) e helpers
  styles/          tokens globais de CSS
```

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Lucide React ·
Recharts.
