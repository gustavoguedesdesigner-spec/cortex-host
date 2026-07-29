# CORTEX HOST — contexto do projeto

Protótipo comercial navegável de uma plataforma SaaS de **inteligência operacional
para restaurantes, bares, cervejarias e redes gastronômicas multiunidade**.

Cliente-piloto: **Salvador Brewing Co.** (6 unidades). O produto é projetado desde o
início para ser replicável a outras empresas do setor.

## O que o produto faz

Não substitui o PDV nem o ERP do cliente. É uma camada de integração, controle e
inteligência que conecta vendas, fichas técnicas, estoque, compras, recebimento,
fornecedores, perdas e CMV para responder, todo dia:

- o que deveria ter acontecido;
- o que realmente aconteceu;
- onde existem diferenças;
- quanto essas diferenças custam;
- quais ações devem ser realizadas.

## Estado atual

Protótipo front-end **sem backend**, com dados simulados. Já construído:

- **Login** (sem autenticação real — `leo@salvadorbrewing.com.br` / `salvador123`)
- **Shell**: trilho lateral compacto (72px, expande no hover), barra superior,
  drawer mobile, navegação inferior no mobile
- **Central de Operações** (tela principal, profundidade total)
- **Visão das Unidades** (cards, tabela comparativa, matriz de desempenho,
  filtros, comparação de 2–4 unidades, rankings)
- **Detalhe da Unidade** (`/unidades/:unitId`) — Moinhos é a unidade aprofundada
  para demonstração; as outras 5 são navegáveis e coerentes
- **Assistente CORTEX** (painel lateral + página) com respostas simuladas
- Páginas estruturais para CMV, Estoque, Compras, Recebimentos, Fornecedores,
  Fichas Técnicas, Biblioteca, Configurações

### Próxima etapa planejada
Aprofundar o **módulo de CMV**. Não avançar para outros módulos antes disso.

## Stack

React 18 · TypeScript · Vite · Tailwind CSS · React Router · Lucide React · Recharts.
Sem backend, sem integrações reais, sem IA real.

```
npm install
npm run dev      # http://localhost:5173
npm run build    # vite build (NÃO usa tsc -b: quebra o deploy)
npm run typecheck
```

## Design system (refactor visual concluído)

**Dois temas (claro e escuro)** sobre os *mesmos* nomes semânticos. As cores são
CSS vars em `src/styles/index.css` (`:root` = claro, `:root[data-theme='dark']` =
escuro) expostas ao Tailwind em `tailwind.config.ts` como
`rgb(var(--c-*) / <alpha-value>)`. O tema é alternado no `data-theme` do `<html>`
via `useAppState().toggleTheme`, persistido em `cortex-host:theme`.

**Nunca usar cor hardcoded nos componentes** — quebra o tema escuro. Componente
não sabe qual tema está ativo; só consome o token.

- Superfícies (escala crescente): `canvas` → `shell` (sidebar/topbar) → `surface`
  → `surface-raised` (inputs, modais, drawers) → `surface-soft`/`subtle` → `surface-hover`
- Texto: `ink-primary` / `ink-secondary` / `ink-tertiary` / `ink-disabled`
- Estrutura: `navy` — ações estruturais e painel do login; no escuro vira
  superfície elevada neutra (não some no fundo)
- Assinatura: `accent` (#FF5A1F, laranja, igual nos dois temas) — pontuação
  visual, **nunca decoração**; não preencher grandes áreas
- Status (só com significado operacional): `success`, `warning`, `danger`, `info`,
  `steel`, cada um com `-soft` (fundo) e `-line` (borda). `danger-solid` é o
  fundo do botão destrutivo — separado de `danger` porque um contrasta com texto
  branco e o outro com o fundo suave do badge
- Gráficos: consumir as CSS vars `--chart-accent`, `--chart-navy`, `--chart-neutral`,
  `--chart-grid`, `--chart-axis`, `--chart-tooltip-*`, `--chart-legend-text`

### Princípios visuais a preservar

- Composição **editorial e assimétrica** (grade de 12 colunas: 8+4, 7+5, largura total)
- **Nem toda informação vira card** — usar seções com divisores quando não houver
  necessidade de superfície própria
- Indicadores em `MetricStrip` (faixa única com separadores), não em cards repetidos
- Tabelas limpas: sem grade completa, sem zebra forte, números tabulares (`.tabular`)
- Status nunca comunicado só por cor — sempre ponto/ícone + texto
- Sombras discretas; sem glassmorphism, gradiente, glow ou blur decorativo
- Transições de 140–200ms; sem bounce, zoom ou animação contínua
- IA integrada à linguagem do produto: sem roxo, sparkles, cérebro, robô ou avatar

## Regras de dados (importante)

**Toda a camada de mocks está em `src/data/` e é a fonte única de verdade.**
Não duplicar números em componentes. Não gerar valores aleatórios — tudo é fixo
para manter consistência entre telas.

Valores consolidados que devem bater em qualquer tela:

- CMV real da rede: **34,8%** · teórico: **31,9%** · meta: **32,5%**
- Impacto financeiro total: **R$ 27.460** (soma das categorias em `financial-impact.ts`)
- 18 ocorrências, 3 críticas · perdas: R$ 18.320 · estoque: R$ 312.850 · compras: R$ 428.700
- Unidades ordenadas por criticidade: Moinhos (36,9%), Caxias Centro (36,1%),
  Zona Norte (34,2%), Caxias Norte (33,9%), Cidade Baixa (33,6%), Serra (31,8%)
- Moinhos: impacto R$ 11.320, 5 alertas, gerente Rafael Martins

Os **nomes das unidades são demonstrativos** e devem ser substituídos após
validação com o cliente (ver comentário em `src/data/units.ts`).

## Estrutura

```
src/
  components/
    ui/            design system (Button, Card, MetricStrip, Table, Drawer...)
    layout/        AppShell, Header, NavigationRail, BottomNav, Logo
    navigation/    navConfig + NavItem/NavGroup
    data-display/  gráficos, UnitStatusCard, PerformanceMatrix, UnitsTable
    cortex/        componentes de IA (insights, painel, ocorrências, modais)
  pages/
    central-operacoes/   seções da Central
    unidades/            seções da Visão das Unidades
    unidade-detail/      seções do Detalhe da Unidade
  data/          mocks centralizados
  types/         tipos compartilhados
  hooks/         useLocalStorageState, useOccurrenceStatus, useCreatedActions...
  context/       AppStateContext (período, unidade, painéis, sessão, askCortex)
  routes/        proteção de rota simulada
  utils/         format (moeda BRL, percentual, datas) e cn
```

## Convenções

- **Interface 100% em português do Brasil.** Sem texto em inglês visível ao usuário.
- Moeda `R$ 27.460` · percentual `34,8%` · pontos percentuais `+2,3 p.p.`
- Comentários no código em português, apenas quando explicam uma decisão não óbvia
- Componentes pequenos, tipados, sem duplicação
- Ícones Lucide, 16–19px, `strokeWidth={1.7}`

## Não fazer

- Não criar backend, banco de dados ou integrações reais
- Não implementar OCR real nem IA real (respostas do CORTEX são simuladas)
- Não alterar os números demonstrativos sem necessidade
- Não usar lorem ipsum, emojis como ícones ou imagens genéricas de IA
- Não usar cor hardcoded (quebra o tema escuro) nem voltar à sidebar em trilho compacto
- Não deixar botões principais sem resposta ou links quebrados

## Deploy

GitHub: `gustavoguedesdesigner-spec/cortex-host` (branch `main`) → deploy automático
na Vercel. O `vercel.json` tem o rewrite de SPA para as rotas do React Router
funcionarem em acesso direto/refresh.
