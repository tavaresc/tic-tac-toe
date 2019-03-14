import * as React from "react";
import "./index.css";
import { Square } from "./Square";

export interface Props {
  squares: Array<string | undefined>;
  winnerSquares: Array<number> | undefined;
  onClick(index: number): void;
}

class Board extends React.Component<Props> {
  renderSquare(isWinnerSquare: boolean, i: number) {
    return (
      <Square
        reactKey={"square" + i}
        value={this.props.squares[i]}
        winner={isWinnerSquare}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  drawBoard() {
    const boardSize = 3;
    let board = [];
    for (let i = 0; i < boardSize; i++) {
      let row = [];
      for (let j = 0; j < boardSize; j++) {
        const squareIndex = i * boardSize + j;
        const isWinnerSquare = this.props.winnerSquares
          ? this.props.winnerSquares.includes(squareIndex)
          : false;
        row.push(this.renderSquare(isWinnerSquare, squareIndex));
      }
      board.push(
        <div key={"row" + i} className="board-row">
          {row}
        </div>
      );
    }

    let boardSizeArray = Array.from(new Array(boardSize), (_, index) => index);
    const boardArray = boardSizeArray.map(_ => boardSizeArray);

    let board2: Array<JSX.Element> = [];
    
    boardArray.flatMap((rowIndex, i) => {
      let row: Array<JSX.Element> = rowIndex.map((_, j) => {
        const squareIndex = i * boardSize + j;
        const isWinnerSquare = this.props.winnerSquares
          ? this.props.winnerSquares.includes(squareIndex)
          : false;
        return this.renderSquare(isWinnerSquare, squareIndex);
      });
      board2.push(
        <div key={"row" + i} className="board-row">
          {row}
        </div>
      );
    });

    //console.log(board2)
    return board2;
  }

  render() {
    return <div>{this.drawBoard()}</div>;
  }
}

export { Board };
