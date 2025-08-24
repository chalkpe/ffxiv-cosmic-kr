import { useEffect, useRef } from 'react'
import { useFetcher } from 'react-router'
import { LoaderIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useAtom } from 'jotai/react'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { worldNames } from '~/lib/constants'
import type { loader } from '~/routes/home'
import type { action } from '~/routes/api/comment'
import { lastCommentAtom, sentAtAtom } from '~/stores'
import ReactGA from 'react-ga4'
import { format } from 'date-fns/format'
import { ko as locale } from 'date-fns/locale/ko'

export type CommentCardProps = {
  server: Awaited<ReturnType<typeof loader>>['servers'][number]
}

export const CommentCard = ({ server }: CommentCardProps) => {
  const fetcher = useFetcher<typeof action>({ key: server.world })
  const formRef = useRef<HTMLFormElement>(null)

  const [lastComment, setLastComment] = useAtom(lastCommentAtom)
  const [sentAt, setSentAt] = useAtom(sentAtAtom)

  // 전송 시작 시 폼 초기화
  useEffect(() => {
    if (fetcher.state === 'submitting') {
      formRef.current?.reset()
    }
  }, [fetcher.state])

  // 전송 완료 시 서버 기준으로 값 업데이트
  useEffect(() => {
    if (fetcher.data?.payload) {
      setLastComment(fetcher.data.payload.content)
      setSentAt(new Date(fetcher.data.payload.createdAt).getTime())
    }
  }, [fetcher.data])

  return (
    <article key={server.world} className="p-5 sm:p-0 rounded w-full sm:w-64 flex flex-col gap-4">
      <fetcher.Form
        ref={formRef}
        method="post"
        action="/api/comment"
        onSubmit={(e) => {
          const comment = (formRef.current?.elements.namedItem('comment') as HTMLInputElement).value.trim()
          if (comment === lastComment) {
            e.preventDefault()
            toast.error('같은 내용을 반복해서 작성할 수 없어요.')
            return
          }

          const now = new Date().getTime()
          if (sentAt && now - sentAt < 10000) {
            e.preventDefault()
            toast.error('10초에 한 번만 댓글을 작성할 수 있어요.')
            return
          }

          setLastComment(comment)
          setSentAt(now)
          ReactGA.event({ category: '댓글', action: '작성', label: server.world })
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
        <input type="submit" className="hidden" accessKey="enter" disabled={fetcher.state !== 'idle'} />
      </fetcher.Form>
      <ScrollArea className="h-96">
        <div className="flex flex-col">
          {fetcher.formData && (
            <div className="not-last:border-b-2 border-background py-2 text-[#C9CBD080] break-all">
              {fetcher.formData.get('comment')?.toString()} <LoaderIcon className="inline align-middle size-3 animate-spin" />
            </div>
          )}
          {server.comments.map((comment) => (
            <div key={comment.id} className="not-last:border-b-2 border-background py-2 text-[#C9CBD0] break-all">
              <span className="select-none opacity-50">{format(new Date(comment.createdAt), 'HH:mm', { locale })} </span>
              <span>{comment.content}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </article>
  )
}
