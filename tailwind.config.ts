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
        canvas: '#F5F6F7',
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#F0F2F4',
          hover: '#F7F8F9',
        },
        ink: {
          primary: '#171A1F',
          secondary: '#656B75',
          tertiary: '#9297A0',
        },
        navy: {
          DEFAULT: '#132033',
          hover: '#1B2A40',
        },
        accent: {
          DEFAULT: '#FF5A1F',
          hover: '#E94C12',
          soft: '#FFF0E9',
        },
        success: { DEFAULT: '#3E9E6B', soft: '#EAF8F0' },
        warning: { DEFAULT: '#B9812A', soft: '#FFF6E4' },
        danger: { DEFAULT: '#D33F4D', soft: '#FDECEF' },
        info: { DEFAULT: '#4C71AE', soft: '#EEF3FA' },
        border: {
          DEFAULT: '#E4E7EB',
          strong: '#D6DADF',
        },
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'section-title': ['1.125rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        'card-title': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '600' }],
        metric: ['1.75rem', { lineHeight: '2rem', letterSpacing: '-0.02em', fontWeight: '600' }],
        'metric-sm': ['1.375rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em', fontWeight: '600' }],
        body: ['0.875rem', { lineHeight: '1.375rem', fontWeight: '400' }],
        support: ['0.8125rem', { lineHeight: '1.25rem', fontWeight: '400' }],
        label: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
        caption: ['0.75rem', { lineHeight: '1.125rem', fontWeight: '400' }],
        badge: ['0.75rem', { lineHeight: '1rem', fontWeight: '500' }],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '8px',
        md: '10px',
        lg: '12px',
        xl: '14px',
      },
      boxShadow: {
        subtle: '0 1px 2px rgba(16, 24, 40, 0.04)',
        card: '0 4px 18px rgba(16, 24, 40, 0.05)',
        raised: '0 8px 26px rgba(16, 24, 40, 0.07)',
        overlay: '0 16px 48px rgba(16, 24, 40, 0.12)',
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
