/**
 * Preparo de imagens enviadas pelo usuario antes de irem para o localStorage.
 *
 * O localStorage tem cota de ~5 MB por origem e guarda texto — uma foto crua
 * em base64 (que ja cresce ~33% sobre o binario) estoura essa cota com dois ou
 * tres uploads. Por isso toda imagem passa por redimensionamento e recompressao
 * em canvas antes de ser guardada. SVG e a excecao: e texto, ja e pequeno e
 * rasteriza-lo destruiria a escalabilidade da marca.
 */

export interface CompressOptions {
  /** Maior dimensao permitida (px). A proporcao original e sempre preservada. */
  maxDimension: number
  /** 'image/jpeg' para fotos (menor arquivo); 'image/png' para marcas (preserva transparencia). */
  mimeType: 'image/jpeg' | 'image/png'
  /** Ignorado em PNG, que e sem perdas. */
  quality?: number
}

/** Limite do arquivo de origem — evita travar a aba tentando decodificar algo gigante. */
const MAX_SOURCE_BYTES = 12 * 1024 * 1024

export const ACCEPTED_IMAGE_TYPES = 'image/png,image/jpeg,image/webp,image/svg+xml'

export function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) return 'Selecione um arquivo de imagem.'
  if (file.size > MAX_SOURCE_BYTES) return 'Imagem muito grande. Use um arquivo de até 12 MB.'
  return null
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = () => reject(new Error('Não foi possível ler o arquivo.'))
    reader.readAsDataURL(file)
  })
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Não foi possível abrir a imagem.'))
    img.src = src
  })
}

/**
 * Redimensiona e recomprime, devolvendo um data URL pronto para persistir.
 * SVG passa direto, sem rasterizar.
 */
export async function compressImage(file: File, options: CompressOptions): Promise<string> {
  const sourceDataUrl = await readAsDataUrl(file)
  if (file.type === 'image/svg+xml') return sourceDataUrl

  const img = await loadImage(sourceDataUrl)
  const maior = Math.max(img.naturalWidth, img.naturalHeight)
  const escala = maior > options.maxDimension ? options.maxDimension / maior : 1

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(img.naturalWidth * escala)
  canvas.height = Math.round(img.naturalHeight * escala)

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Não foi possível processar a imagem neste navegador.')

  /* JPEG não tem canal alpha: sem um fundo explícito, áreas transparentes viram preto. */
  if (options.mimeType === 'image/jpeg') {
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
  }

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL(options.mimeType, options.quality)
}
