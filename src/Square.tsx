import * as React from 'react'
import './index.css'

export type Props = {
  value: string | undefined
  winner: boolean
  onClick: () => void
  reactKey: number
}

function Square(props: Props) {
  const { value, winner, reactKey } = props
  const className = winner ? 'winner-square' : 'square'

  return (
    <button key={reactKey} className={className} onClick={props.onClick}>
      {value}
    </button>
  )
}

export { Square };