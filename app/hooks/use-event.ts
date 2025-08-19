import { useEventSource } from 'remix-utils/sse/react'
import type { EventPayloadMap } from '~/lib/data.server'

export function useEvent<K extends keyof EventPayloadMap>({ type }: { type: K }) {
  const raw = useEventSource('/events', { event: type })
  return raw ? (JSON.parse(raw) as EventPayloadMap[K]) : null
}
