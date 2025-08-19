import { emitter, type EventData } from '~/lib/data.server'
import { eventStream } from 'remix-utils/sse/server'
import type { Route } from './+types/events'

export async function loader({ request }: Route.LoaderArgs) {
  return eventStream(request.signal, (send) => {
    const listener = (data: EventData) => send({ event: data.type, data: JSON.stringify(data.payload) })

    emitter.on('data', listener)
    return () => emitter.off('data', listener)
  })
}
