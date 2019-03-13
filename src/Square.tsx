import * as React from 'react'
import './index.css'

export interface Props {
  value: number | undefined
  winner: Boolean
  onClick: () => void
}

function Square(props: Props) {
  const { value, winner } = props
  const className = winner ? 'winner-square' : 'square'

  return (
    <button className={className} onClick={props.onClick}>
      {value}
    </button>
  )
}

export default Square;