'use client'

// Видео с объектов (Арборист «Видео», Арбористик, Мастер лес). Сначала только обложка —
// плеер подгружается по нажатию, чтобы не тянуть скрипты видеохостинга при загрузке страницы.

import { useState } from 'react'

import { Icon, Picture, Section, SectionHead, Wrap } from './shared'
import type { SectionTone, VideoGalleryBlock, VideoItem } from './types'
import s from './VideoGallery.module.css'

function Player({ item }: { item: VideoItem }) {
  if (!item.url) return null
  if (/\.(mp4|webm)(\?|$)/.test(item.url)) {
    return <video className={s.player} src={item.url} controls autoPlay playsInline />
  }
  return (
    <iframe
      className={s.player}
      src={item.url}
      title={item.title}
      allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
      allowFullScreen
    />
  )
}

export function VideoGallery(block: VideoGalleryBlock & { tone?: SectionTone | null }) {
  const items = block.items ?? []
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(false)
  if (items.length === 0) return null
  const main = items[active]

  return (
    <Section tone={block.tone ?? 'default'} anchor={block.anchor}>
      <Wrap>
        {block.title && (
          <SectionHead eyebrow={block.eyebrow} title={block.title} link={block.link} />
        )}
        <div className={s.grid}>
          <div className={s.main}>
            {playing && main.url ? (
              <Player item={main} />
            ) : (
              <>
                <Picture
                  image={main.poster}
                  sizes="(max-width: 1023px) 100vw, 60vw"
                  className={s.poster}
                  tagPosition="tr"
                />
                <button
                  type="button"
                  className={s.play}
                  disabled={!main.url}
                  aria-label={main.url ? `Смотреть: ${main.title}` : 'Ролик появится позже'}
                  onClick={() => setPlaying(true)}
                >
                  <Icon name="play" size={32} />
                </button>
                <div className={s.caption}>
                  <b>{main.title}</b>
                  {main.duration && <span>{main.duration}</span>}
                </div>
              </>
            )}
          </div>
          {items.length > 1 && (
            <ul className={s.list}>
              {items.map((it, i) =>
                i === active ? null : (
                  <li key={i}>
                    <button
                      type="button"
                      className={s.item}
                      onClick={() => {
                        setActive(i)
                        setPlaying(false)
                      }}
                    >
                      <span className={s.thumb}>
                        <Picture
                          image={{ ...it.poster, illustration: false }}
                          sizes="132px"
                          className={s.thumbImg}
                        />
                        {it.duration && <i>{it.duration}</i>}
                      </span>
                      <span className={s.itemText}>
                        <b>{it.title}</b>
                        {it.text && <span>{it.text}</span>}
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          )}
        </div>
      </Wrap>
    </Section>
  )
}
