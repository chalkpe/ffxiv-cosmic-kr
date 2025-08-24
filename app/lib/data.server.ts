import { EventEmitter } from 'node:events'
import type { CommentModel } from '~/lib/prisma.server'

export type EventPayloadMap = {
  UPDATE_PROGRESS: { id: string }
  ADD_COMMENT: CommentModel
}

export type EventData = {
  [K in keyof EventPayloadMap]: { type: K; payload: EventPayloadMap[K] }
}[keyof EventPayloadMap]

export const emitter = new EventEmitter()

export const dispatch = (data: EventData) => emitter.emit('data', data)

emitter.setMaxListeners(Infinity)
