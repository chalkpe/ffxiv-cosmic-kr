import { type PropsWithChildren } from 'react'

type ProgressProps = {
  progress: number
  max: number
}

export const Progress = ({ progress, max, children }: PropsWithChildren<ProgressProps>) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row gap-2 justify-between items-center">
        <div className="flex flex-row gap-2 justify-start items-center">
          <span className="text-lg text-[#9496A0] font-bold">{children}</span>
          <span className="text-lg text-[#9496A0]">
            {progress} / {max}
          </span>
        </div>
        <nav className="flex flex-row gap-2 justify-center items-center">
          <button className="text-sm text-[#9496A0] cursor-pointer">-</button>
          <button className="text-sm text-[#9496A0] cursor-pointer">+</button>
        </nav>
      </div>
      <div className="flex flex-col justify-center items-start bg-background">
        <div className="h-4 bg-[#6755D1]" style={{ width: `${(progress / max) * 100}%` }}></div>
      </div>
    </div>
  )
}
