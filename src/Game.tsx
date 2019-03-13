import * as React from 'react'
import * as ReactDOM from 'react-dom'
import './index.css'
import Board from './Board'

export type HistoryElem = {
  squares: Array<number | undefined>
  squareIndex: number
}

export interface Props {
  history: Array<HistoryElem>
  stepNumber: number
  xIsNext: Boolean
  isDescendingSorted: Boolean
}

class Game extends React.Component {
  constructor(props: Game) {
    /* Calling 'super' is mandatory in a constructor of a subclass */
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(undefined),
          squareIndex: -1
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescendingSorted: true
    }
  }

  nextPlayer(): String {
    return this.state.xIsNext ? 'X' : 'O'
  }

  handleClick(i: number) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (calculateWinner(squares).winnerSymbol) return
    squares[i] = this.nextPlayer()
    this.setState({
      history: history.concat([{ squares: squares, squareIndex: i }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  jumpTo(step: number) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    })
  }

  sortMoves() {
    this.setState({ isDescendingSorted: !this.state.isDescendingSorted })
  }

  render() {
    const history = this.state.history
    const stepNumber = this.state.stepNumber
    const current = history[stepNumber]
    const { winnerSquares, winnerSymbol } = calculateWinner(current.squares)

    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start'
      const col = step.squareIndex > -1 ? step.squareIndex % 3 : 'col'
      const row =
        step.squareIndex > -1 ? Math.floor(step.squareIndex / 3) : 'row'

      return (
        <li key={move}>
          <button
            className={move === stepNumber ? 'selected-item' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {desc} ({col}, {row})
          </button>
        </li>
      )
    })

    const maxStepNumber = history[0].squares.length
    const status = winnerSymbol
      ? 'Winner: ' + winnerSymbol
      : stepNumber === maxStepNumber
      ? 'Draw result'
      : 'Next player: ' + this.nextPlayer()

    const isDescendingSorted = this.state.isDescendingSorted
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winnerSquares={winnerSquares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortMoves()}>
            {isDescendingSorted ? 'Ascending sort' : 'Descending sort'}
          </button>
          <ol>{isDescendingSorted ? moves : moves.reverse()}</ol>
        </div>
      </div>
    )
  }
}

type Winner = {
  winnerSquares: Array<number> | undefined
  winnerSymbol: number | undefined
}

function calculateWinner(squares: Array<number>): Winner {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] === squares[b] && squares[b] === squares[c]) {
      const winnerSymbol = squares[a]
      return {
        winnerSquares: winnerSymbol ? lines[i] : undefined,
        winnerSymbol: winnerSymbol
      }
    }
  }
  return { winnerSquares: undefined, winnerSymbol: undefined }
}
// ========================================
export default Game
