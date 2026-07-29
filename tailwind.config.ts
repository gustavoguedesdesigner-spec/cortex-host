import type { Config } from 'tailwindcss'

/**
 * CORTEX HOST — Design System
 * -----------------------------------------------------------------
 * Tema claro único. Tokens semânticos: nada de cor hardcoded nos
 * componentes. Laranja é assinatura (pontuação, não decoração);
 * azul-marinho estrutura; status apenas com significado operacional.
 */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      /**
       * Cores como CSS vars (RGB cru + <alpha-value>) para suportar tema claro
       * e escuro sem duplicar classe nos componentes: os nomes semânticos são
       * os mesmos nos dois temas — só os valores mudam em [data-theme="dark"].
       */
      colors: {
        canvas: 'rgb(var(--c-canvas) / <alpha-value>)',
        /** Fundo de sidebar e topbar — no claro é branco, no escuro é distinto do canvas. */
        shell: 'rgb(var(--c-shell) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--c-surface) / <alpha-value>)',
          subtle: 'rgb(var(--c-surface-subtle) / <alpha-value>)',
          hover: 'rgb(var(--c-surface-hover) / <alpha-value>)',
          raised: 'rgb(var(--c-surface-raised) / <alpha-value>)',
          soft: 'rgb(var(--c-surface-soft) / <alpha-value>)',
        },
        ink: {
          primary: 'rgb(var(--c-ink-primary) / <alpha-value>)',
          secondary: 'rgb(var(--c-ink-secondary) / <alpha-value>)',
          tertiary: 'rgb(var(--c-ink-tertiary) / <alpha-value>)',
          disabled: 'rgb(var(--c-ink-disabled) / <alpha-value>)',
        },
        navy: {
          DEFAULT: 'rgb(var(--c-navy) / <alpha-value>)',
          hover: 'rgb(var(--c-navy-hover) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--c-accent) / <alpha-value>)',
          hover: 'rgb(var(--c-accent-hover) / <alpha-value>)',
          soft: 'rgb(var(--c-accent-soft) / <alpha-value>)',
          line: 'rgb(var(--c-accent-line) / <alpha-value>)',
        },
        /* Paleta secundária suave: fundos discretos com bordas correspondentes (-line). */
        success: {
          DEFAULT: 'rgb(var(--c-success) / <alpha-value>)',
          soft: 'rgb(var(--c-success-soft) / <alpha-value>)',
          line: 'rgb(var(--c-success-line) / <alpha-value>)',
        },
        warning: {
          DEFAULT: 'rgb(var(--c-warning) / <alpha-value>)',
          soft: 'rgb(var(--c-warning-soft) / <alpha-value>)',
          line: 'rgb(var(--c-warning-line) / <alpha-value>)',
        },
        danger: {
          DEFAULT: 'rgb(var(--c-danger) / <alpha-value>)',
          soft: 'rgb(var(--c-danger-soft) / <alpha-value>)',
          line: 'rgb(var(--c-danger-line) / <alpha-value>)',
          solid: 'rgb(var(--c-danger-solid) / <alpha-value>)',
        },
        info: {
          DEFAULT: 'rgb(var(--c-info) / <alpha-value>)',
          soft: 'rgb(var(--c-info-soft) / <alpha-value>)',
          line: 'rgb(var(--c-info-line) / <alpha-value>)',
        },
        steel: {
          DEFAULT: 'rgb(var(--c-steel) / <alpha-value>)',
          soft: 'rgb(var(--c-steel-soft) / <alpha-value>)',
          line: 'rgb(var(--c-steel-line) / <alpha-value>)',
        },
        border: {
          DEFAULT: 'rgb(var(--c-border) / <alpha-value>)',
          strong: 'rgb(var(--c-border-strong) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        /* Títulos de destaque (heros/saudações) — usar com moderação. */
        display: ['2.75rem', { lineHeight: '3.125rem', letterSpacing: '-0.03em', fontWeight: '600' }],
        'page-title': ['2.125rem', { lineHeight: '2.5rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'page-title-sm': ['1.625rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'section-title': ['1.25rem', { lineHeight: '1.625rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        'card-title': ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '600' }],
        metric: ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em', fontWeight: '600' }],
        'metric-sm': ['1.5rem', { lineHeight: '1.875rem', letterSpacing: '-0.015em', fontWeight: '600' }],
        /* Subtítulos e descrições de página. */
        lead: ['1.0625rem', { lineHeight: '1.625rem', fontWeight: '400' }],
        body: ['0.9375rem', { lineHeight: '1.5rem', fontWeight: '400' }],
        support: ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        label: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }],
        badge: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '8px',
        DEFAULT: '10px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      /* Sombras via var para ficarem minimas no tema escuro (profundidade vem da superficie, nao da sombra). */
      boxShadow: {
        subtle: 'var(--shadow-subtle)',
        card: 'var(--shadow-card)',
        raised: 'var(--shadow-raised)',
        overlay: 'var(--shadow-overlay)',
      },
      maxWidth: {
        content: '1560px',
      },
      transitionDuration: {
        DEFAULT: '160ms',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideInRight: {
          '0%': { transform: 'translateX(12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
      },
      animation: {
        'fade-in': 'fadeIn 160ms ease-out',
        'slide-in-right': 'slideInRight 180ms cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
