import { useSearchParams } from 'react-router'
import { worldNames } from '~/lib/constants'
import { Progress } from '~/components/intro/servers/progress'
import { UpdatedAt } from '~/components/updated-at'
import type { ServerModel } from '~/lib/prisma.server'
import type { FC } from 'react'

export type ServerCardProps = {
  server: ServerModel
  disabled: boolean
  onChangeProgress: (progress: number) => void
  onChangeSubprogress: (subprogress: number) => void
}

export const ServerCard: FC<ServerCardProps> = ({ server, disabled, onChangeProgress, onChangeSubprogress }) => {
  const [searchParams] = useSearchParams()

  return (
    <article key={server.world} className="p-5 rounded bg-[#0C1826] w-64 flex flex-col gap-8">
      <div className="flex flex-row justify-between items-start">
        <h1 className="font-bold text-4xl">{worldNames[server.world]}</h1>
        <div className="flex flex-col items-end text-right">
          <span className="text-[#9496A0] text-xs">수정시간</span>
          <UpdatedAt className="text-[#9496A0] text-xs" updatedAt={server.updatedAt} />
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <Progress progress={server.progress} max={20} disabled={disabled} onChange={onChangeProgress}>
          현재 단계
        </Progress>
        <Progress progress={server.subprogress} max={8} disabled={disabled} onChange={onChangeSubprogress}>
          세부 단계
        </Progress>
      </div>
    </article>
  )
}
