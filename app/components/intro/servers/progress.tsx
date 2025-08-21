import { type PropsWithChildren } from 'react'
import { MinusIcon, PlusIcon } from 'lucide-react'

type ProgressProps = {
  progress: number
  max: number
  disabled: boolean
  onChange: (value: number) => void
}

export const Progress = ({ progress, max, disabled, onChange, children }: PropsWithChildren<ProgressProps>) => {
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
          <button
            disabled={disabled || progress <= 0}
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={() => !disabled && progress > 0 && onChange(Math.max(progress - 1, 0))}
          >
            <MinusIcon color="#9496A0" className="size-3" />
            <span className="sr-only">감소</span>
          </button>
          <button
            disabled={disabled || progress >= max}
            className="cursor-pointer disabled:cursor-not-allowed"
            onClick={() => !disabled && progress < max && onChange(Math.min(progress + 1, max))}
          >
            <PlusIcon color="#9496A0" className="size-3" />
            <span className="sr-only">증가</span>
          </button>
        </nav>
      </div>
      <div className="flex flex-col justify-center items-start bg-background h-4">
        <div className="h-4 bg-[#6755D1] transition-all" style={{ width: `${(progress / max) * 100}%` }}></div>
      </div>
    </div>
  )
}
