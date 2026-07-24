import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { CortexMark } from '@/components/cortex/CortexMark'
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
    // Simulacao de autenticacao — sem backend nesta etapa.
    window.setTimeout(() => {
      setIsLoading(false)
      login()
      navigate('/', { replace: true })
    }, 600)
  }

  function handlePreencherDemo() {
    setEmail(demoCredentials.email)
    setSenha(demoCredentials.senha)
    setErro(null)
  }

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-base">
      {/* Coluna do formulario */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5">
            <CortexMark className="h-7 w-7 text-cortex-500" />
            <div>
              <p className="font-display text-lg font-semibold tracking-tight text-content-primary">
                CORTEX <span className="text-cortex-500 font-extrabold">HOST</span>
              </p>
              <p className="text-caption text-content-tertiary">Powered by ZAKA AI</p>
            </div>
          </div>

          <h1 className="text-display-md mb-1.5">Entrar na plataforma</h1>
          <p className="text-body text-content-secondary mb-8">Inteligência operacional para hospitalidade.</p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
                className="absolute right-3 top-[2.15rem] text-content-tertiary hover:text-content-secondary"
              >
                {showSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {erro && (
              <p role="alert" className="text-support text-status-critical">
                {erro}
              </p>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-support text-content-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={manterConectado}
                  onChange={(e) => setManterConectado(e.target.checked)}
                  className="h-4 w-4 rounded border-border bg-surface-2 accent-cortex-500 cursor-pointer"
                />
                Manter conectado
              </label>
              <button type="button" className="text-support text-cortex-500 hover:text-cortex-400 transition-colors">
                Esqueci minha senha
              </button>
            </div>

            <Button type="submit" size="lg" isLoading={isLoading} rightIcon={<ArrowRight className="h-4 w-4" />} className="mt-2">
              Entrar
            </Button>
          </form>

          <button
            onClick={handlePreencherDemo}
            className="mt-5 w-full rounded-md border border-dashed border-border bg-surface-2/60 px-3.5 py-2.5 text-support text-content-tertiary transition-colors hover:border-border-strong hover:text-content-secondary"
          >
            Usar acesso de demonstração ({demoCredentials.email})
          </button>
        </div>
      </div>

      {/* Coluna visual complementar */}
      <div className="hidden lg:flex relative flex-col justify-between overflow-hidden bg-surface-1 border-l border-border-subtle px-14 py-16">
        <div
          className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, #C2793D 0%, transparent 70%)' }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full opacity-10 blur-3xl"
          style={{ background: 'radial-gradient(circle, #4E88C4 0%, transparent 70%)' }}
          aria-hidden="true"
        />

        <div className="relative flex items-center gap-2 text-content-tertiary">
          <CortexMark className="h-5 w-5 text-cortex-500" animated />
          <span className="text-label uppercase tracking-wide">Central de inteligência operacional</span>
        </div>

        <div className="relative">
          <p className="text-display-lg max-w-lg leading-tight">
            Veja onde a margem está sendo perdida e saiba o que fazer agora.
          </p>
          <p className="text-body text-content-secondary max-w-md mt-4">
            O CORTEX HOST conecta vendas, fichas técnicas, estoque, compras e recebimento para mostrar, todos os dias,
            o que deveria ter acontecido, o que realmente aconteceu e onde estão as diferenças.
          </p>
        </div>

        <div className="relative flex items-center gap-6 text-caption text-content-tertiary">
          <span>Salvador Brewing Co.</span>
          <span aria-hidden="true">•</span>
          <span>6 unidades conectadas</span>
        </div>
      </div>
    </div>
  )
}
