import rabbit from './rabbit.png'
import { UpdatedAt } from '~/components/updated-at'

export type LogoProps = {
  updatedAt: Date
}

export function Logo({ updatedAt }: LogoProps) {
  return (
    <nav className="flex flex-col xl:flex-row items-end gap-2 ">
      <h1 className="font-logo text-9xl flex flex-col xl:flex-row gap-0.5">
        <span>월면</span>
        <img src={rabbit} alt="토끼" className="size-32 aspect-square" />
        <span>
          공동
          <br className="block xl:hidden" />
          계획
        </span>
      </h1>
      <p className="flex flex-col">
        <span className="text-xl">수정시간</span>
        <UpdatedAt className="text-xl text-[#9496A0] font-bold" updatedAt={updatedAt} />
      </p>
    </nav>
  )
}
