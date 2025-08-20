import { randomUUID } from 'node:crypto'
import type { Route } from './+types/home'
import { Logo } from '../components/logo/logo'
import { Progress } from '~/components/server/progress'
import { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Input } from '~/components/ui/input'
import { prisma, World } from '~/lib/prisma.server'
import { commentCount, worldNames } from '~/lib/constants'
import { UpdatedAt } from '~/components/updated-at'
import { dispatch, getRecentComments, type EventPayloadMap } from '~/lib/data.server'
import { useFetcher, useRevalidator } from 'react-router'
import { useEvent } from '~/hooks/use-event'
import { Toaster } from '~/components/ui/sonner'
import { toast } from 'sonner'

export function meta({}: Route.MetaArgs) {
  return [{ title: '월면 공동계획' }, { name: 'description', content: 'TODO: 설명' }]
}

export async function loader({}: Route.LoaderArgs) {
  const worlds = Object.values(World)
  const servers = await prisma.server.findMany()

  if (servers.length < worlds.length) {
    for (const world of worlds) {
      if (servers.some((s) => s.world === world)) continue
      servers.push({ world, progress: 0, subprogress: 0, updatedAt: new Date(0) })
    }
  }

  return { servers, recentComments: getRecentComments() }
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { servers, recentComments } = loaderData

  const revalidator = useRevalidator()
  const fetcher = useFetcher<typeof action>()

  const formRef = useRef<Record<World, HTMLFormElement | null>>({
    KrCarbuncle: null,
    KrChocobo: null,
    KrMoogle: null,
    KrTonberry: null,
    KrFenrir: null,
  })
  const [sentAt, setSentAt] = useState<Date | null>(null)
  useEffect(() => {
    if (fetcher.data?.ok && fetcher.data?.world) {
      setSentAt(new Date())
      formRef.current[fetcher.data.world]?.reset()
    }
  }, [fetcher.data?.id])

  const [comments, setComments] = useState<Record<World, EventPayloadMap['ADD_COMMENT'][]>>(recentComments)

  const comment = useEvent({ type: 'ADD_COMMENT' })
  useEffect(() => {
    if (comment) {
      setComments((prev) => ({ ...prev, [comment.world]: [comment, ...prev[comment.world]].slice(0, commentCount) }))
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
            <article key={server.world} className="p-5 rounded bg-[#0C1826] w-64 flex flex-col gap-8">
              <div className="flex flex-row justify-between items-start">
                <h1 className="font-bold text-4xl">{worldNames[server.world]}</h1>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[#9496A0] text-xs">수정시간</span>
                  <UpdatedAt className="text-[#9496A0] text-xs" updatedAt={server.updatedAt} />
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Progress
                  progress={server.progress}
                  max={20}
                  disabled={fetcher.state !== 'idle'}
                  onChange={(v) => fetcher.submit({ progress: v.toString(), server: server.world }, { method: 'post' })}
                >
                  현재 단계
                </Progress>
                <Progress
                  progress={server.subprogress}
                  max={8}
                  disabled={fetcher.state !== 'idle'}
                  onChange={(v) => fetcher.submit({ subprogress: v.toString(), server: server.world }, { method: 'post' })}
                >
                  세부 단계
                </Progress>
              </div>
            </article>
          ))}
        </section>
      </div>
      <div className="w-full bg-[#0C1826] py-10">
        <section className="mx-auto container flex flex-col sm:flex-row flex-wrap gap-5 justify-center items-center">
          {servers.map((server) => (
            <article key={server.world} className="p-5 sm:p-0 rounded w-full sm:w-64 flex flex-col gap-4">
              <fetcher.Form
                method="post"
                ref={(el) => {
                  formRef.current[server.world] = el
                }}
                onSubmit={(e) => {
                  if (sentAt && new Date().getTime() - sentAt.getTime() < 1000) {
                    e.preventDefault()
                    toast.error('1초에 한 번만 댓글을 작성할 수 있어요.')
                  }
                }}
              >
                <input type="text" name="server" value={server.world} className="hidden" readOnly />
                <Input
                  type="text"
                  name="comment"
                  className="outline-none placeholder:text-[#C9CBD0]"
                  placeholder={`${worldNames[server.world]} 댓글 입력...`}
                  minLength={1}
                  maxLength={100}
                  autoComplete="off"
                />
                <input type="submit" className="hidden" accessKey="enter" />
              </fetcher.Form>
              <ScrollArea className="h-72">
                <div className="flex flex-col">
                  {comments[server.world].map((comment) => (
                    <div key={comment.id} className="not-last:border-b-2 border-background py-2 text-[#C9CBD0] break-all">
                      {comment.text}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </article>
          ))}
        </section>
      </div>
      <footer className="w-full px-5 py-10">
        <section className="mx-auto container flex flex-col justify-center items-center text-center gap-2 text-[#9496A0] text-lg text-balance break-keep">
          <span>이 프로젝트는 스퀘어 에닉스와 아무런 관련이 없습니다.</span>
          <span>
            문의 및 버그 제보는{' '}
            <a href="https://github.com/chalkpe" className="font-bold underline">
              깃허브
            </a>{' '}
            또는{' '}
            <a href="https://chalk.moe/@chalk" className="font-bold underline">
              마스토돈
            </a>
            으로 연락해주세요.
          </span>
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

  if (formData.has('comment')) {
    const comment = formData.get('comment')?.toString()
    if (!comment) return { id, ok: false }

    const text = comment.trim()
    if (text.length <= 0 || text.length > 100) return { id, ok: false }

    dispatch({ type: 'ADD_COMMENT', payload: { id, world, text } })
    return { id, ok: true, world }
  }

  if (formData.has('progress')) {
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
