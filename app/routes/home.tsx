import type { Route } from './+types/home'
import { Logo } from '../components/logo/logo'
import { Progress } from '~/components/server/progress'
import { useState } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import { Input } from '~/components/ui/input'

export function meta({}: Route.MetaArgs) {
  return [{ title: '월면 공동계획' }, { name: 'description', content: 'TODO: 설명' }]
}

const servers = ['카벙클', '초코보', '모그리', '톤베리', '펜리르']

export default function Home() {
  const [comments, setComments] = useState<string[]>([])

  return (
    <main className="h-screen flex flex-col items-center">
      <div className="w-full py-10 gap-28 flex flex-col justify-center items-center">
        <Logo />
        <section className="mx-auto container flex flex-row flex-wrap gap-5 justify-center items-center">
          {servers.map((server) => (
            <article key={server} className="p-5 rounded bg-[#0C1826] w-64 flex flex-col gap-8">
              <div className="flex flex-row justify-between items-start">
                <h1 className="font-bold text-4xl">{server}</h1>
                <div className="flex flex-col items-end text-right">
                  <span className="text-[#9496A0] text-xs">수정시간</span>
                  <span className="text-[#9496A0] text-xs">8/15 12시</span>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <Progress progress={10} max={20}>
                  현재 단계
                </Progress>
                <Progress progress={4} max={8}>
                  세부 단계
                </Progress>
              </div>
            </article>
          ))}
        </section>
      </div>
      <div className="w-full bg-[#0C1826] py-10">
        <section className="mx-auto container flex flex-row flex-wrap gap-5 justify-center items-center">
          {servers.map((server) => (
            <article key={server} className="p-5 rounded w-64 flex flex-col gap-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  const formData = new FormData(e.currentTarget)
                  const comment = formData.get('comment') as string
                  setComments((prev) => [comment, ...prev])
                  e.currentTarget.reset()
                }}
              >
                <Input
                  type="text"
                  name="comment"
                  className="outline-none placeholder:text-[#C9CBD0]"
                  placeholder={`${server} 댓글 입력...`}
                  autoComplete="off"
                />
                <input type="submit" className="hidden" accessKey="enter" />
              </form>
              <ScrollArea className="h-72">
                <div className="flex flex-col">
                  {comments.map((comment, key) => (
                    <div key={key} className="not-last:border-b-2 border-background py-2 text-[#C9CBD0] break-all">
                      {comment}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </article>
          ))}
        </section>
      </div>
      <footer className="w-full py-10">
        <section className="mx-auto container flex flex-col justify-center items-center text-center gap-1">
          <span className="text-[#9496A0] text-lg">이 프로젝트는 스퀘어 에닉스와 아무런 관련이 없습니다.</span>
          <span className="text-[#9496A0] text-lg">
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
