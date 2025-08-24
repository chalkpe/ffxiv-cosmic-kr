import type { Route } from './+types/comment'

import { dispatch } from '~/lib/data.server'
import { prisma, World } from '~/lib/prisma.server'

export async function action({ request }: Route.ActionArgs) {
  const formData = await request.formData()

  const server = formData.get('server')?.toString()
  if (!server) return { ok: false }

  const world = Object.values(World).find((w) => w === server)
  if (!world) return { ok: false }

  const comment = formData.get('comment')?.toString()
  if (!comment) return { ok: false }

  const content = comment.trim()
  if (content.length <= 0 || content.length > 100) return { ok: false }

  const payload = await prisma.comment.create({ data: { world, content } })
  dispatch({ type: 'ADD_COMMENT', payload })
  return { ok: true, payload }
}
