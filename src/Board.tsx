import * as React from 'react'
import './index.css'
import { Square } from './Square'
import { range } from 'fp-ts/lib/Array'

export interface Props {
  squares: Array<string | undefined>
  winnerSquares: Array<number> | undefined
  onClick(index: number): void
}

function Board(props: Props) {
  function renderSquare(isWinnerSquare: boolean, i: number) {
    return (
      <Square
        reactKey={i}
        key={i}
        value={props.squares[i]}
        winner={isWinnerSquare}
        onClick={() => props.onClick(i)}
      />
    )
  }

  function drawBoard() {
    const boardSize = 3
    const boardSizeArray = range(0, boardSize - 1)
    const boardArray = boardSizeArray.map(_ => boardSizeArray)

    const board = boardArray.flatMap((rowIndex, i) => {
      let row: Array<JSX.Element> = rowIndex.map((_, j) => {
        const squareIndex = i * boardSize + j
        const isWinnerSquare = props.winnerSquares
          ? props.winnerSquares.includes(squareIndex)
          : false
        return renderSquare(isWinnerSquare, squareIndex)
      })

      return (
        <div key={'row' + i} className="board-row">
          {row}
        </div>
      )
    })

    return board
  }

  return <div>{drawBoard()}</div>
}

export { Board }
