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
      colors: {
        canvas: '#F7F7F6',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F2F3F2',
          hover: '#F8F8F7',
        },
        ink: {
          primary: '#17181A',
          secondary: '#63666C',
          tertiary: '#94979E',
        },
        navy: {
          DEFAULT: '#132033',
          hover: '#1B2A40',
        },
        accent: {
          DEFAULT: '#FF5A1F',
          hover: '#E94C12',
          soft: '#FFF1EA',
          line: '#FFD9C7',
        },
        /* Paleta secundária suave: fundos claros com bordas correspondentes (-line). */
        success: { DEFAULT: '#358A5E', soft: '#ECF7F0', line: '#CDE9D8' },
        warning: { DEFAULT: '#A8761F', soft: '#FCF6E8', line: '#F0E2BD' },
        danger: { DEFAULT: '#C93B49', soft: '#FDEFF0', line: '#F5D2D6' },
        info: { DEFAULT: '#4A6FA9', soft: '#EFF3F9', line: '#D6E0EF' },
        steel: { DEFAULT: '#5E6B7E', soft: '#EFF1F4', line: '#DCE1E8' },
        border: {
          DEFAULT: '#E8E9E8',
          strong: '#D9DAD9',
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
      boxShadow: {
        subtle: '0 1px 2px rgba(20, 22, 25, 0.03)',
        card: '0 1px 2px rgba(20, 22, 25, 0.03), 0 4px 14px rgba(20, 22, 25, 0.04)',
        raised: '0 2px 4px rgba(20, 22, 25, 0.04), 0 10px 28px rgba(20, 22, 25, 0.06)',
        overlay: '0 16px 48px rgba(20, 22, 25, 0.14)',
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
