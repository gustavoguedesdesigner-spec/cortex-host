import { useCallback, useState, useSyncExternalStore } from 'react'
import { compressImage, validateImageFile, type CompressOptions } from '@/utils/imageUpload'

/**
 * Imagens enviadas pelo cliente para ambientar o produto (banners das paginas,
 * painel do login e marca). Ficam so no navegador — nao ha backend nesta etapa.
 *
 * O store e um modulo compartilhado, e nao um useLocalStorageState por
 * componente: a marca aparece em varios lugares ao mesmo tempo (trilho lateral,
 * topo mobile, login) e todas as instancias precisam reagir ao mesmo upload.
 * useSyncExternalStore garante isso sem prop drilling nem context extra.
 */
export type ImageSlotId =
  | 'login'
  | 'banner-central'
  | 'banner-unidades'
  | 'banner-cmv'
  | 'banner-biblioteca'
  | 'banner-fornecedores'
  | 'banner-recebimentos'
  | 'marca-simbolo'
  | 'marca-assinatura'

const STORAGE_KEY = 'cortex-host:imagens'

type ImageStore = Record<string, string>

let cache: ImageStore | null = null
const listeners = new Set<() => void>()

function readStore(): ImageStore {
  if (cache) return cache
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    cache = raw ? (JSON.parse(raw) as ImageStore) : {}
  } catch {
    cache = {}
  }
  return cache
}

function persist(next: ImageStore) {
  cache = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((l) => l())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** Perfis de compressao por tipo de slot — marca preserva transparencia, banner prioriza tamanho. */
const PERFIS: Record<'banner' | 'marca', CompressOptions> = {
  banner: { maxDimension: 1600, mimeType: 'image/jpeg', quality: 0.82 },
  marca: { maxDimension: 512, mimeType: 'image/png' },
}

function perfilDoSlot(slot: ImageSlotId): CompressOptions {
  return slot.startsWith('marca-') ? PERFIS.marca : PERFIS.banner
}

export function useImageSlot(slot: ImageSlotId) {
  const src = useSyncExternalStore(
    subscribe,
    () => readStore()[slot] ?? null,
    () => null,
  )
  const [isBusy, setIsBusy] = useState(false)
  const [erro, setErro] = useState<string | null>(null)

  const upload = useCallback(
    async (file: File) => {
      setErro(null)
      const invalido = validateImageFile(file)
      if (invalido) {
        setErro(invalido)
        return
      }

      setIsBusy(true)
      try {
        const perfil = perfilDoSlot(slot)
        let dataUrl = await compressImage(file, perfil)
        try {
          persist({ ...readStore(), [slot]: dataUrl })
        } catch {
          /* Cota estourada: tenta uma vez com compressao mais agressiva antes de desistir. */
          dataUrl = await compressImage(file, { ...perfil, maxDimension: Math.round(perfil.maxDimension * 0.6), quality: 0.7 })
          try {
            persist({ ...readStore(), [slot]: dataUrl })
          } catch {
            setErro('Espaço de armazenamento do navegador cheio. Remova outra imagem e tente de novo.')
          }
        }
      } catch (e) {
        setErro(e instanceof Error ? e.message : 'Não foi possível enviar a imagem.')
      } finally {
        setIsBusy(false)
      }
    },
    [slot],
  )

  const remover = useCallback(() => {
    setErro(null)
    const atual = readStore()
    if (!(slot in atual)) return
    const proximo = { ...atual }
    delete proximo[slot]
    try {
      persist(proximo)
    } catch {
      setErro('Não foi possível remover a imagem.')
    }
  }, [slot])

  return { src, upload, remover, isBusy, erro }
}
