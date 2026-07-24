import type { DemoUser } from '@/types'

/**
 * Usuario demonstrativo do prototipo.
 * Credenciais utilizadas apenas na tela de login (sem autenticacao real).
 */
export const demoUser: DemoUser = {
  nome: 'Leo',
  cargo: 'Socio e Diretor de Operacoes',
  empresa: 'Salvador Brewing Co.',
  perfil: 'Administrador Corporativo',
  email: 'leo@salvadorbrewing.com.br',
  iniciais: 'LE',
}

export const demoCredentials = {
  email: 'leo@salvadorbrewing.com.br',
  senha: 'salvador123',
}
