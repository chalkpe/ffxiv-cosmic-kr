import { randomUUID } from 'node:crypto'
import type { Route } from './+types/home'
import { Logo } from '../components/intro/logo/logo'
import { useEffect } from 'react'
import { prisma, World } from '~/lib/prisma.server'
import { commentCount } from '~/lib/constants'
import { dispatch } from '~/lib/data.server'
import { useFetcher, useRevalidator, useSearchParams } from 'react-router'
import { useEvent } from '~/hooks/use-event'
import { Toaster } from '~/components/ui/sonner'
import { ServerCard } from '~/components/intro/servers/server-card'
import { CommentCard } from '~/components/comments/comment-card'
import { frequentlyAskedQuestions } from '~/components/faq/faq'
import ReactGA from 'react-ga4'

export async function loader({}: Route.LoaderArgs) {
  const worlds = Object.values(World)
  const servers = await prisma.server.findMany({
    select: {
      world: true,
      progress: true,
      subprogress: true,
      updatedAt: true,
      comments: { orderBy: { createdAt: 'desc' }, take: commentCount },
    },
  })

  if (servers.length < worlds.length) {
    for (const world of worlds) {
      if (servers.find((s) => s.world === world)) continue
      const server = await prisma.server.create({ data: { world, updatedAt: new Date(0) } })
      servers.push({ ...server, comments: [] })
    }
  }

  return { servers }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { servers } = loaderData
  const fetcher = useFetcher<typeof action>()
  const revalidator = useRevalidator()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    ReactGA.initialize('G-CQZC3CPN2P')
  }, [])

  const comment = useEvent({ type: 'ADD_COMMENT' })
  useEffect(() => {
    if (comment && revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, [comment?.id])

  const updated = useEvent({ type: 'UPDATE_PROGRESS' })
  useEffect(() => {
    if (updated && revalidator.state === 'idle') {
      revalidator.revalidate()
    }
  }, [updated?.id])

  return (
    <main className="h-screen flex flex-col items-center">
      <Toaster />
      <div className="w-full py-10 gap-28 flex flex-col justify-center items-center">
        <Logo updatedAt={servers.reduce((latest, { updatedAt }) => (updatedAt > latest ? updatedAt : latest), new Date(0))} />
        <section className="mx-auto container flex flex-col sm:flex-row flex-wrap gap-5 justify-center items-center">
          {servers.map((server) => (
            <ServerCard
              key={server.world}
              server={server}
              disabled={!searchParams.has('secret') || fetcher.state !== 'idle'}
              onChangeProgress={(v) =>
                fetcher.submit({ progress: v.toString(), server: server.world, secret: searchParams.get('secret') }, { method: 'post' })
              }
              onChangeSubprogress={(v) =>
                fetcher.submit({ subprogress: v.toString(), server: server.world, secret: searchParams.get('secret') }, { method: 'post' })
              }
            />
          ))}
        </section>
      </div>
      <div className="w-full bg-[#0C1826] py-10">
        <section className="mx-auto container flex flex-col sm:flex-row flex-wrap gap-5 justify-center items-center">
          {servers.map((server) => (
            <CommentCard key={server.world} server={server} />
          ))}
        </section>
      </div>
      <div className="w-full py-10 flex flex-col justify-center items-center gap-10">
        <h1 className="text-4xl font-bold">FAQ</h1>
        <section className="mx-auto container flex flex-col sm:flex-row flex-wrap gap-10 justify-center items-start">
          {frequentlyAskedQuestions.map((faq) => (
            <article key={faq.question} className="p-5 sm:p-0 rounded w-full sm:w-64 flex flex-col gap-4">
              <nav className="flex flex-row justify-between items-center">
                <h2 className="text-xl font-bold">{faq.question}</h2>
                {faq.details}
              </nav>
              <div className="break-keep">{faq.answer}</div>
            </article>
          ))}
        </section>
      </div>
      <footer className="w-full px-5 py-10 bg-[#0C1826]">
        <section className="mx-auto container flex flex-col justify-center items-center text-center gap-2 text-[#9496A0] text-lg text-balance break-keep">
          <span>이 프로젝트는 스퀘어 에닉스와 아무런 관련이 없습니다.</span>
        </section>
      </footer>
    </main>
  )
}

export async function action({ request }: Route.ActionArgs) {
  const id = randomUUID()
  const formData = await request.formData()

  const server = formData.get('server')?.toString()
  if (!server) return { id, ok: false }

  const world = Object.values(World).find((w) => w === server)
  if (!world) return { id, ok: false }

  if (formData.has('progress')) {
    if (formData.get('secret')?.toString() !== process.env.ADMIN_SECRET) return { id, ok: false }

    const p = formData.get('progress')?.toString()
    if (!p) return { id, ok: false }

    const progress = parseInt(p, 10)
    if (isNaN(progress) || progress < 0 || progress > 20) return { id, ok: false }

    await prisma.server.upsert({
      where: { world },
      update: { progress },
      create: { world, progress, subprogress: 0 },
    })

    dispatch({ type: 'UPDATE_PROGRESS', payload: { id } })
    return { id, ok: true }
  }

  if (formData.has('subprogress')) {
    if (formData.get('secret')?.toString() !== process.env.ADMIN_SECRET) return { id, ok: false }

    const s = formData.get('subprogress')?.toString()
    if (!s) return { id, ok: false }

    const subprogress = parseInt(s, 10)
    if (isNaN(subprogress) || subprogress < 0 || subprogress > 8) return { id, ok: false }

    const server = await prisma.server.upsert({
      where: { world },
      update: { subprogress },
      create: { world, progress: 0, subprogress },
    })

    if (server.subprogress === 8 && server.progress < 20) {
      await prisma.server.update({
        where: { world },
        data: { progress: server.progress + 1, subprogress: 0 },
      })
    }

    dispatch({ type: 'UPDATE_PROGRESS', payload: { id } })
    return { id, ok: true }
  }

  return { id, ok: false }
}
