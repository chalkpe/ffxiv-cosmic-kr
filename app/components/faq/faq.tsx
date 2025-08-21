import { ExternalLinkIcon } from 'lucide-react'
import { Button } from '../ui/button'

import desc1 from './desc_1.png'
import desc2 from './desc_2.png'

export const frequentlyAskedQuestions = [
  {
    question: '우주 개척이란?',
    answer: (
      <p className="flex flex-col gap-2">
        <span>우주 개척은 제작자/채집가가 협력해 별들을 탐색하는 콘텐츠입니다.</span>
        <span>
          탐색이 진행되면 기지의 외관이 변할 뿐만 아니라, 탐색을 편리하게 진행할 수 있는 설비를 이용할 수 있게 되거나 경험치 등의 보상을
          획득할 수 있습니다.
        </span>
      </p>
    ),
  },
  {
    question: '진척도가 달라요',
    answer: (
      <p className="flex flex-col gap-2">
        <span>
          우주 임무를 완료하면 작업 진행도가 상승하며, 게이지가 가득 차면 공동 시공 작업이 시작됩니다. 이 공동 시공 작업을 완료하면 다음
          단계로 넘어갑니다.
        </span>
        <span>
          현재 사이트는 <span className="font-bold text-[#15BAE8]">[개척 진행도]</span>와{' '}
          <span className="font-bold text-[#6755D1]">[세부 진행도]</span>만 사용 합니다.
        </span>
      </p>
    ),
    details: (
      <Button onClick={() => window.open(desc1)}>
        <ExternalLinkIcon /> 자세히
      </Button>
    ),
  },
  {
    question: '뭘 보면 되나요?',
    answer: (
      <p className="flex flex-col gap-2">
        <span>개척 진행도는 상단의 ~웨이가 말하는 말로 판단합니다. (20단계) 탐색의 발자취는 왼쪽의 제~호로 판단합니다.</span>
      </p>
    ),
    details: (
      <Button onClick={() => window.open(desc2)}>
        <ExternalLinkIcon /> 자세히
      </Button>
    ),
  },
  {
    question: '문제가 있어요!',
    answer: (
      <p className="flex flex-col gap-2">
        <span>
          문의 및 버그 제보는 상단 채팅,{' '}
          <a href="https://github.com/chalkpe" className="font-bold underline">
            깃허브
          </a>{' '}
          또는{' '}
          <a href="https://chalk.moe/@chalk" className="font-bold underline">
            마스토돈
          </a>
          으로 연락해 주세요.
        </span>
      </p>
    ),
  },
]
