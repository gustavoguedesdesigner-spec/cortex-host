import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/layout/Logo'
import { UploadableEditorialPanel } from '@/components/ui/ImageUpload'
import { useAppState } from '@/context/AppStateContext'
import { demoCredentials } from '@/data/user'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAppState()

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [showSenha, setShowSenha] = useState(false)
  const [manterConectado, setManterConectado] = useState(true)
  const [erro, setErro] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErro(null)
    if (!email || !senha) {
      setErro('Informe e-mail e senha para continuar.')
      return
    }
    setIsLoading(true)
    window.setTimeout(() => {
      setIsLoading(false)
      login()
      navigate('/', { replace: true })
    }, 500)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 bg-surface lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
      {/* Formulário */}
      <div className="flex flex-col justify-between px-6 py-10 sm:px-12 lg:px-16 lg:py-12">
        <Logo showSignature />

        <div className="mx-auto w-full max-w-[360px] py-12">
          <h1 className="text-page-title">Entrar na plataforma</h1>
          <p className="mt-1.5 text-body text-ink-secondary">Inteligência operacional para hospitalidade.</p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4" noValidate>
            <Input
              label="E-mail"
              type="email"
              autoComplete="email"
              placeholder="voce@empresa.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showSenha ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowSenha((v) => !v)}
                aria-label={showSenha ? 'Ocultar senha' : 'Mostrar senha'}
                className="absolute right-3 top-[2.2rem] text-ink-tertiary transition-colors hover:text-ink-secondary"
              >
                {showSenha ? <EyeOff className="h-4 w-4" strokeWidth={1.7} /> : <Eye className="h-4 w-4" strokeWidth={1.7} />}
              </button>
            </div>

            {erro && (
              <p role="alert" className="text-support text-danger">
                {erro}
              </p>
            )}

            <div className="flex items-center justify-between text-support">
              <label className="flex cursor-pointer items-center gap-2 text-ink-secondary">
                <input
                  type="checkbox"
                  checked={manterConectado}
                  onChange={(e) => setManterConectado(e.target.checked)}
                  className="h-4 w-4 cursor-pointer rounded border-border accent-accent"
                />
                Manter conectado
              </label>
              <button type="button" className="font-medium text-accent transition-colors hover:text-accent-hover">
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="h-4 w-4" strokeWidth={1.7} />} className="mt-1">
              Entrar
            </Button>
          </form>

          <button
            onClick={() => {
              setEmail(demoCredentials.email)
              setSenha(demoCredentials.senha)
              setErro(null)
            }}
            className="mt-4 w-full rounded-md border border-dashed border-border-strong py-2.5 text-caption text-ink-tertiary transition-colors hover:border-border-strong hover:bg-surface-hover hover:text-ink-secondary"
          >
            Usar acesso de demonstração
          </button>
        </div>

        <p className="text-caption text-ink-tertiary">Powered by ZAKA AI</p>
      </div>

      {/* Painel editorial */}
      <UploadableEditorialPanel
        slot="login"
        rotulo="Imagem do painel de login"
        className="hidden px-16 py-14 lg:flex lg:flex-col lg:justify-between"
        decoracao={
          <>
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.16]"
              style={{
                backgroundImage:
                  'linear-gradient(to right, rgba(255,255,255,0.28) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.28) 1px, transparent 1px)',
                backgroundSize: '68px 68px',
              }}
              aria-hidden="true"
            />
            <div className="pointer-events-none absolute -right-24 top-24 h-64 w-64 rounded-full border border-accent/25" aria-hidden="true" />
            <div className="pointer-events-none absolute right-16 top-56 h-24 w-24 rounded-full bg-accent/90" aria-hidden="true" />
          </>
        }
      >
        <span className="relative text-label uppercase tracking-[0.18em] text-white/45">Central de inteligência operacional</span>

        <div className="relative max-w-lg">
          <p className="text-[2.125rem] font-semibold leading-[1.2] tracking-tight text-white">
            Veja onde a margem está sendo perdida e saiba o que fazer agora.
          </p>
          <p className="mt-5 max-w-md text-body leading-relaxed text-white/60">
            O CORTEX HOST conecta vendas, fichas técnicas, estoque, compras e recebimento para mostrar, todos os dias, o que
            deveria ter acontecido, o que realmente aconteceu e onde estão as diferenças.
          </p>
        </div>

        <div className="relative flex items-center gap-8 border-t border-white/10 pt-6 text-caption text-white/45">
          <span>Salvador Brewing Co.</span>
          <span>6 unidades conectadas</span>
        </div>
      </UploadableEditorialPanel>
    </div>
  )
}
