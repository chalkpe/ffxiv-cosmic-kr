import Queue from 'yocto-queue'
import { EventEmitter } from 'node:events'
import { commentCount } from '~/lib/constants'
import type { World } from '~/lib/prisma.server'

export type EventPayloadMap = {
  UPDATE_PROGRESS: { id: string }
  ADD_COMMENT: { id: string; world: World; text: string }
}

export type EventData = {
  [K in keyof EventPayloadMap]: { type: K; payload: EventPayloadMap[K] }
}[keyof EventPayloadMap]

export const emitter = new EventEmitter()

export const dispatch = (data: EventData) => emitter.emit('data', data)

const queueMap: Record<World, Queue<EventPayloadMap['ADD_COMMENT']>> = {
  KrCarbuncle: new Queue(),
  KrChocobo: new Queue(),
  KrMoogle: new Queue(),
  KrTonberry: new Queue(),
  KrFenrir: new Queue(),
}

export const getRecentComments = () => ({
  KrCarbuncle: [...queueMap.KrCarbuncle].reverse(),
  KrChocobo: [...queueMap.KrChocobo].reverse(),
  KrMoogle: [...queueMap.KrMoogle].reverse(),
  KrTonberry: [...queueMap.KrTonberry].reverse(),
  KrFenrir: [...queueMap.KrFenrir].reverse(),
})

emitter.setMaxListeners(Infinity)
emitter.on('data', (data: EventData) => {
  switch (data.type) {
    case 'ADD_COMMENT': {
      const queue = queueMap[data.payload.world]
      queue.enqueue(data.payload)
      while (queue.size > commentCount) queue.dequeue()
      break
    }
  }
})
