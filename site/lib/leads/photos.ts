import { randomUUID } from 'node:crypto'

import sharp from 'sharp'

/**
 * Фото к заявке: до 5 файлов, каждый до 10 МБ, вместе до 24 МБ (nginx пропускает 25).
 * Формат проверяем по сигнатуре, а не по имени и Content-Type; принимаем JPEG, PNG и WebP
 * (HEIC сборка sharp не читает — браузер iPhone присылает JPEG сам, с компьютера просим JPG).
 * Каждое фото перекодируем в JPEG до 2000 px по длинной стороне: метаданные (EXIF, координаты
 * GPS) при этом не переносятся, поворот берём из EXIF до снятия.
 */
export const PHOTO_LIMITS = { count: 5, fileBytes: 10 * 1024 * 1024, totalBytes: 24 * 1024 * 1024 }

export type PhotoError = { field: 'photos'; index: number; message: string }
export type ProcessedPhoto = { data: Buffer; name: string; size: number; mimetype: 'image/jpeg' }

function sniff(buf: Buffer): 'jpeg' | 'png' | 'webp' | 'heic' | null {
  if (buf.length < 12) return null
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return 'jpeg'
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'png'
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP')
    return 'webp'
  if (
    buf.toString('ascii', 4, 8) === 'ftyp' &&
    /^(heic|heix|hevc|mif1|msf1)/.test(buf.toString('ascii', 8, 12))
  )
    return 'heic'
  return null
}

/** Проверить и перекодировать; ошибки — по номеру файла, чтобы форма показала их у фото. */
export async function processPhotos(
  files: File[],
): Promise<{ photos: ProcessedPhoto[]; errors: PhotoError[] }> {
  const errors: PhotoError[] = []
  if (files.length > PHOTO_LIMITS.count)
    return {
      photos: [],
      errors: [{ field: 'photos', index: -1, message: `Не больше ${PHOTO_LIMITS.count} фото` }],
    }
  const total = files.reduce((s, f) => s + f.size, 0)
  if (total > PHOTO_LIMITS.totalBytes)
    return {
      photos: [],
      errors: [{ field: 'photos', index: -1, message: 'Фото вместе больше 24 МБ — уберите часть' }],
    }
  const photos: ProcessedPhoto[] = []
  for (const [index, file] of files.entries()) {
    if (file.size > PHOTO_LIMITS.fileBytes) {
      errors.push({ field: 'photos', index, message: 'Фото больше 10 МБ' })
      continue
    }
    const buf = Buffer.from(await file.arrayBuffer())
    const kind = sniff(buf)
    if (kind === 'heic') {
      errors.push({
        field: 'photos',
        index,
        message: 'Формат HEIC не открывается — сохраните фото как JPG',
      })
      continue
    }
    if (!kind) {
      errors.push({ field: 'photos', index, message: 'Это не фото: подойдут JPG, PNG или WebP' })
      continue
    }
    try {
      const data = await sharp(buf, { limitInputPixels: 80_000_000, failOn: 'error' })
        .rotate()
        .resize({ width: 2000, height: 2000, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toBuffer()
      photos.push({
        data,
        name: `lead-${randomUUID()}.jpg`,
        size: data.length,
        mimetype: 'image/jpeg',
      })
    } catch {
      errors.push({ field: 'photos', index, message: 'Фото повреждено — попробуйте другое' })
    }
  }
  return { photos, errors }
}
