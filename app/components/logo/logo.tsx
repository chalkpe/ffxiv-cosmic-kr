import rabbit from './rabbit.png'
import { useEffect, useState } from 'react'
import { format } from 'date-fns/format'
import { ko as locale } from 'date-fns/locale/ko'

export function Logo() {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(interval)
  }, [])

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
        <span className="text-xl text-[#9496A0] font-bold">{format(now, 'M/d H시', { locale })}</span>
      </p>
    </nav>
  )
}
