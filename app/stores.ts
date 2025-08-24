import { atomWithStorage } from 'jotai/utils'

export const sentAtAtom = atomWithStorage<number>('sentAt', 0)
export const lastCommentAtom = atomWithStorage<string>('lastComment', '')
