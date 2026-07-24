import type { Config } from 'tailwindcss'

/**
 * CORTEX HOST - Design System / Tailwind tokens
 * -----------------------------------------------
 * Paleta e escala tipografica descritas no README de design (src/styles/tokens.md).
 * Tema escuro por padrao, com estrutura preparada para futura variante clara
 * (ver estrategia de "surface levels" abaixo, que pode ser invertida).
 */
const config: Config = {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Base / superficies (profundidade por camadas, nao por sombra pesada) ---
        base: {
          DEFAULT: '#0B1013', // fundo geral: grafite/petroleo quase preto
          950: '#080C0E',
        },
        surface: {
          1: '#10161A', // sidebar / header
          2: '#151C21', // cards, superficie padrao de conteudo
          3: '#1B2329', // hover, selecionado, popovers
          4: '#232C33', // modais, drawers, camada mais alta
        },
        border: {
          subtle: '#232B31',
          DEFAULT: '#2B3339',
          strong: '#3A444C',
        },
        content: {
          primary: '#EDEFF0',
          secondary: '#9CA8AE',
          tertiary: '#6C7880',
          disabled: '#4B565C',
        },
        // --- Cor de marca: cobre / ambar sofisticado ---
        cortex: {
          50: '#FBEEE3',
          100: '#F4D9BE',
          200: '#EABE8F',
          300: '#DFA265',
          400: '#D28A47',
          500: '#C2793D', // principal
          600: '#A9642F',
          700: '#875028',
          800: '#623B1F',
          900: '#402816',
        },
        // --- Status operacional ---
        status: {
          success: '#4E9E74',
          successBg: 'rgba(78,158,116,0.12)',
          attention: '#D2A23F',
          attentionBg: 'rgba(210,162,63,0.12)',
          critical: '#CF5C4E',
          criticalBg: 'rgba(207,92,78,0.12)',
          info: '#4E88C4',
          infoBg: 'rgba(78,136,196,0.12)',
          neutral: '#6C7880',
          neutralBg: 'rgba(108,120,128,0.12)',
        },
      },
      fontFamily: {
        // Manrope: titulos, numeros de indicador, navegacao (geometrica, precisa)
        display: ['"Manrope"', 'system-ui', 'sans-serif'],
        // Inter: corpo de texto, formularios, tabelas (alta legibilidade em texto denso)
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        'page-title': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        'card-title': ['0.9375rem', { lineHeight: '1.375rem', fontWeight: '600' }],
        'metric': ['1.875rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '700' }],
        'metric-sm': ['1.375rem', { lineHeight: '1.625rem', letterSpacing: '-0.01em', fontWeight: '700' }],
        'body': ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        'support': ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        'label': ['0.75rem', { lineHeight: '1rem', fontWeight: '600', letterSpacing: '0.02em' }],
        'caption': ['0.6875rem', { lineHeight: '0.875rem', fontWeight: '500', letterSpacing: '0.02em' }],
        'badge': ['0.6875rem', { lineHeight: '1rem', fontWeight: '600', letterSpacing: '0.01em' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '14px',
        xl: '18px',
      },
      boxShadow: {
        subtle: '0 1px 2px 0 rgba(0,0,0,0.24)',
        card: '0 1px 3px 0 rgba(0,0,0,0.30), 0 1px 2px -1px rgba(0,0,0,0.20)',
        raised: '0 4px 16px -4px rgba(0,0,0,0.45)',
        overlay: '0 12px 40px -8px rgba(0,0,0,0.55)',
      },
      spacing: {
        18: '4.5rem',
        70: '17.5rem',
        72: '18rem',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.55', transform: 'scale(0.82)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(2px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(16px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        'pulse-dot': 'pulseDot 2.2s ease-in-out infinite',
        'fade-in': 'fadeIn 0.16s ease-out',
        'slide-in-right': 'slideInRight 0.22s cubic-bezier(0.16, 1, 0.3, 1)',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
