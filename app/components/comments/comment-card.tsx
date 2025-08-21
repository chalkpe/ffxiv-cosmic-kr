import type { RefObject } from 'react'
import type { FetcherWithComponents } from 'react-router'
import { toast } from 'sonner'
import { Input } from '~/components/ui/input'
import { ScrollArea } from '~/components/ui/scroll-area'
import { worldNames } from '~/lib/constants'
import type { EventPayloadMap } from '~/lib/data.server'
import type { ServerModel, World } from '~/lib/prisma.server'

export type CommentCardProps = {
  fetcher: FetcherWithComponents<unknown>
  server: ServerModel
  comments: Record<World, EventPayloadMap['ADD_COMMENT'][]>
  formRef: RefObject<Record<World, HTMLFormElement | null>>
  sentAt: Date | null
}

export const CommentCard = ({ fetcher, server, comments, formRef, sentAt }: CommentCardProps) => {
  return (
    <article key={server.world} className="p-5 sm:p-0 rounded w-full sm:w-64 flex flex-col gap-4">
      <fetcher.Form
        method="post"
        ref={(el) => {
          formRef.current[server.world] = el
        }}
        onSubmit={(e) => {
          if (sentAt && new Date().getTime() - sentAt.getTime() < 10000) {
            e.preventDefault()
            toast.error('10초에 한 번만 댓글을 작성할 수 있어요.')
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
      <ScrollArea className="h-96">
        <div className="flex flex-col">
          {comments[server.world].map((comment) => (
            <div key={comment.id} className="not-last:border-b-2 border-background py-2 text-[#C9CBD0] break-all">
              {comment.text}
            </div>
          ))}
        </div>
      </ScrollArea>
    </article>
  )
}
