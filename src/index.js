import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
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
        row.push(this.renderSquare(i * boardSize + j))
      }
      board.push(<div className="board-row">{row}</div>)
    }
    return board
  }

  render() {
    return (
      <div>
        {this.drawBoard()}
      </div>
    )
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
      xIsNext: true
    }
  }

  nextPlayer() {
    return this.state.xIsNext ? 'X' : 'O'
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares)) return
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

  render() {
    const history = this.state.history
    const stepNumber = this.state.stepNumber
    const current = history[stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      const descendent = move ? 'Go to move #' + move : 'Go to game start'
      const col = step.squareIndex > -1 ? step.squareIndex % 3 : 'col'
      const row =
        step.squareIndex > -1 ? Math.floor(step.squareIndex / 3) : 'row'

      return (
        <li key={move}>
          <button
            className={move === stepNumber ? 'selected-item' : ''}
            onClick={() => this.jumpTo(move)}
          >
            {descendent} ({col}, {row})
          </button>
        </li>
      )
    })

    let status = winner
      ? 'Winner: ' + winner
      : 'Next player: ' + this.nextPlayer()

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
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
      return squares[a]
    }
  }
  return null
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))
