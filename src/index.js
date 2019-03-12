import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  const className = props.winner ? 'winner-square' : 'square'
  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(isWinnerSquare, i) {
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
        row.push(this.renderSquare(this.props.winnerSquares.includes(squareIndex), squareIndex))
      }
      board.push(<div className="board-row">{row}</div>)
    }
    return board
  }

  render() {
    return <div>{this.drawBoard()}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    /* Calling 'super' is mandatory in a constructor of a subclass */
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          squareIndex: -1
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      isDescendingSorted: true
    }
  }

  nextPlayer() {
    return this.state.xIsNext ? 'X' : 'O'
  }

  handleClick(i) {
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

  jumpTo(step) {
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
    const {winnerSquares, winnerSymbol} = calculateWinner(current.squares)
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

    let status = winnerSymbol
      ? 'Winner: ' + winnerSymbol
      : 'Next player: ' + this.nextPlayer()

    const isDescendingSorted = this.state.isDescendingSorted
    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} winnerSquares={winnerSquares} onClick={i => this.handleClick(i)} />
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

function calculateWinner(squares) {
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
      return {winnerSquares: lines[i], winnerSymbol: squares[a]}
    }
  }
  return null
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))
