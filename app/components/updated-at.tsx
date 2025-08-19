import type { ComponentProps } from 'react'

import { format } from 'date-fns/format'
import { ko as locale } from 'date-fns/locale/ko'

export type UpdatedAtProps = ComponentProps<'time'> & { updatedAt: Date }

export function UpdatedAt({ updatedAt, ...props }: UpdatedAtProps) {
  return (
    <time dateTime={updatedAt.toISOString()} {...props}>
      {updatedAt.getTime() === 0 ? '-' : format(updatedAt, 'M/d H시', { locale })}
    </time>
  )
}
