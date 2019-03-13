import * as React from 'react'
import './index.css'
import Square from './Square'

export interface Props {
  squares: Array<number | undefined>
  winner: Boolean
  onClick(index: number): void
}

class Board extends React.Component<Props> {
  renderSquare(isWinnerSquare: Boolean, i: number) {
    return (
      <Square
        value={this.props.squares[i]}
        winner={isWinnerSquare}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  drawBoard() {
    const boardSize = 3
    let board = []
    for (let i = 0; i < boardSize; i++) {
      let row = []
      for (let j = 0; j < boardSize; j++) {
        const squareIndex = i * boardSize + j
        const isWinnerSquare = this.props.winnerSquares
          ? this.props.winnerSquares.includes(squareIndex)
          : false
        row.push(this.renderSquare(isWinnerSquare, squareIndex))
      }
      board.push(<div className="board-row">{row}</div>)
    }
    return board
  }

  render() {
    return <div>{this.drawBoard()}</div>
  }
}

export default Board
