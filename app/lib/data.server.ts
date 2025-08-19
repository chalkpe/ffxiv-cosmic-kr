import { EventEmitter } from 'node:events'
import type { World } from '~/generated/prisma/client'

export type EventPayloadMap = {
  UPDATE_PROGRESS: { id: string }
  ADD_COMMENT: { id: string; world: World; text: string }
}

export type EventData = {
  [K in keyof EventPayloadMap]: { type: K; payload: EventPayloadMap[K] }
}[keyof EventPayloadMap]

export const emitter = new EventEmitter()
export const dispatch = (data: EventData) => emitter.emit('data', data)
