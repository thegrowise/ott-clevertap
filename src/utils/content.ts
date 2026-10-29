import type { OttTitle } from '../types/ott'
import type { ContentProps } from '../analytics/events'

export function toContentProps(t: OttTitle): ContentProps {
  return {
    content_id: t.id,
    content_title: t.title,
    content_type: t.type,
    genre: t.genre,
    language: t.language,
  }
}
