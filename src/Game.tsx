import * as React from 'react'
import { useState } from 'react'
import './index.css'
import { Board } from './Board'

export type HistoryElem = {
  squares: Array<string | undefined>
  squareIndex: number
}

export type State = {
  history: Array<HistoryElem>
  stepNumber: number
  xIsNext: boolean
  isDescendingSorted: boolean
}

const initialHistory: Array<HistoryElem> = [{ squares: [], squareIndex: -1 }]

function Game() {
  const [history, setHistory] = useState(initialHistory)
  const [stepNumber, setStepNumber] = useState(0)
  const [xIsNext, setXIsNext] = useState(true)
  const [isDescendingSorted, setIsDescendingSorted] = useState(true)

  function nextPlayer(): string {
    return xIsNext ? 'X' : 'O'
  }

  function handleClick(i: number): void {
    const currentHistory = history.slice(0, stepNumber + 1)
    const current = currentHistory[currentHistory.length - 1]
    let squares = current.squares.slice()

    if (calculateWinner(squares).winnerSymbol) return

    squares[i] = nextPlayer()

    setHistory(currentHistory.concat([{ squares: squares, squareIndex: i }]))
    setStepNumber(currentHistory.length)
    setXIsNext(!xIsNext)
  }

  function jumpTo(step: number): void {
    setStepNumber(step)
    setXIsNext(step % 2 === 0)
  }

  function sortMoves(): void {
    setIsDescendingSorted(!isDescendingSorted)
  }

  const currentHistory = history[stepNumber]
  const { winnerSquares, winnerSymbol } = calculateWinner(
    currentHistory.squares as string[]
  )

  const moves = history.map((step, move) => renderMove(step, move))

  function renderMove(step: HistoryElem, move: number) {
    const desc = move ? 'Go to move #' + move : 'Go to game start'
    const col = step.squareIndex > -1 ? step.squareIndex % 3 : 'col'
    const row = step.squareIndex > -1 ? Math.floor(step.squareIndex / 3) : 'row'

    function onSquareClick() {
      jumpTo(move)
    }

    return (
      <li key={move}>
        <button
          className={move === stepNumber ? 'selected-item' : ''}
          onClick={onSquareClick}
        >
          {desc} ({col}, {row})
        </button>
      </li>
    )
  }

  const maxStepNumber = history[0].squares.length
  const status = winnerSymbol
    ? 'Winner: ' + winnerSymbol
    : stepNumber === maxStepNumber
    ? 'Draw result'
    : 'Next player: ' + nextPlayer()

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={currentHistory.squares}
          winnerSquares={winnerSquares}
          // use function call instead of arrow function to avoid evaluation 
          // each time Game is rendered (instead, it only evaluates when Board state changes)
          onClick={handleClick}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <button onClick={() => sortMoves()}>
          {isDescendingSorted ? 'Ascending sort' : 'Descending sort'}
        </button>
        <ol>{isDescendingSorted ? moves : moves.reverse()}</ol>
      </div>
    </div>
  )
}

type Winner = {
  winnerSquares: Array<number> | undefined
  winnerSymbol: string | undefined
}

function calculateWinner(squares: Array<string | undefined>): Winner {
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
export { Game }
