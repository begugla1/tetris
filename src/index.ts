interface TetrominoTemplate {
  color: string;
  shape: number[][];
}

interface Tetromino extends TetrominoTemplate {
  row: number;
  col: number;
}

class Tetris {
  BOARD_WIDTH: number;
  BOARD_HEIGHT: number;
  BLOCK_WIDTH: number;
  BOARD: number[][];
  currentTetromino: Tetromino;
  ghostTetromino: Tetromino;
  tetrominoTemplates: TetrominoTemplate[];

  constructor(
    boardWIDTH: number,
    boardHEIGHT: number,
    blockWidth: number,
    tetrominoTemplates: TetrominoTemplate[]
  ) {
    this.BOARD_WIDTH = boardWIDTH;
    this.BOARD_HEIGHT = boardHEIGHT;
    this.BLOCK_WIDTH = blockWidth;
    this.BOARD = this.generateBoard();

    this.tetrominoTemplates = tetrominoTemplates;
    this.currentTetromino = this.getTetromino();
    this.ghostTetromino = this.currentTetromino;
  }

  private generateBoard(): number[][] {
    const board = [];
    for (let i = 0; i < this.BOARD_HEIGHT; i++) {
      const row = [];
      for (let j = 0; j < this.BOARD_WIDTH; j++) {
        row.push(0);
      }
      board.push(row);
    }
    return board;
  }

  private getTetromino(): Tetromino {
    const index = Math.floor(Math.random() * this.tetrominoTemplates.length);
    const tetrominoTemplate = this.tetrominoTemplates[index];
    const row = 0;
    const col = Math.floor(
      Math.random() * (this.BOARD_WIDTH - tetrominoTemplate.shape[0].length + 1)
    );
    return {
      color: tetrominoTemplate.color,
      shape: tetrominoTemplate.shape,
      row: row,
      col: col,
    };
  }

  private getRotatedShape(shape: number[][]): number[][] {
    const rotatedShape = [];
    for (let i = 0; i < shape[0].length; i++) {
      const rotatedRow = [];
      for (let j = shape.length - 1; j >= 0; j--) {
        rotatedRow.push(shape[j][i]);
      }
      rotatedShape.push(rotatedRow);
    }
    return rotatedShape;
  }

  protected drawTetromino(): void {
    const board = document.getElementById("tetris-window");
    for (let r = 0; r < this.currentTetromino.shape.length; r++) {
      for (let c = 0; c < this.currentTetromino.shape[0].length; c++) {
        if (this.currentTetromino.shape[r][c] !== 0) {
          const row = this.currentTetromino.row;
          const col = this.currentTetromino.col;
          const block = document.createElement("div");
          block.classList.add(
            "block",
            "tb-classic"
          ); /* you must define any style class for block!! (e.g) `tb-classic` */
          block.id = `block-${row + r}-${col + c}`;
          block.style.top = (row + r) * this.BLOCK_WIDTH + "px";
          block.style.left = (col + c) * this.BLOCK_WIDTH + "px";
          block.style.backgroundColor = this.currentTetromino.color;
          board?.appendChild(block);
        }
      }
    }
  }

  protected eraseTetromino(): void {
    for (let r = 0; r < this.currentTetromino.shape.length; r++) {
      for (let c = 0; c < this.currentTetromino.shape[0].length; c++) {
        if (this.currentTetromino.shape[r][c] !== 0) {
          const row = this.currentTetromino.row;
          const col = this.currentTetromino.col;
          const block = document.getElementById(`block-${row + r}-${col + c}`);
          if (block)
            document.getElementById("tetris-window")?.removeChild(block);
        }
      }
    }
  }

  protected fixTetromino(): void {
    for (let r = 0; r < this.currentTetromino.shape.length; r++) {
      for (let c = 0; c < this.currentTetromino.shape[0].length; c++) {
        if (this.currentTetromino.shape[r][c] !== 0) {
          const row = this.currentTetromino.row + r;
          const col = this.currentTetromino.col + c;
          if (this.BOARD[row][col] !== null)
            this.BOARD[row][col] = this.currentTetromino.shape[r][c];
        }
      }
    }
    this.currentTetromino = this.getTetromino();
    this.ghostTetromino = this.currentTetromino;
    this.drawTetromino();
  }

  protected rotateTetromino(): void {
    if (this.canTetrominoMove(0, 0, true)) {
      this.eraseTetromino();
      this.currentTetromino.shape = this.getRotatedShape(
        this.currentTetromino.shape
      );
      this.drawTetromino();
    }
  }

  protected canTetrominoMove(
    rowOffset: number,
    colOffset: number,
    isRotated?: boolean
  ): boolean {
    let shape: number[][];
    if (isRotated) shape = this.getRotatedShape(this.currentTetromino.shape);
    else shape = this.currentTetromino.shape;
    for (let r = 0; r < shape.length; r++) {
      for (let c = 0; c < shape[0].length; c++) {
        if (shape[r][c] !== 0) {
          const row = this.currentTetromino.row + r + rowOffset;
          const col = this.currentTetromino.col + c + colOffset;
          if (
            row >= this.BOARD_HEIGHT ||
            row < 0 ||
            col >= this.BOARD_WIDTH ||
            col < 0 ||
            this.BOARD[row][col] !== 0
          )
            return false;
        }
      }
    }
    return true;
  }

  protected moveTetromino(rowIncrease: number, colIncrease: number): void {
    if (this.canTetrominoMove(rowIncrease, colIncrease)) {
      this.eraseTetromino();
      this.currentTetromino.row += rowIncrease;
      this.currentTetromino.col += colIncrease;
      this.drawTetromino();
      if (rowIncrease === 1 && !this.canTetrominoMove(rowIncrease, colIncrease))
        this.fixTetromino();
    }
  }

  protected tetrominoMoveHandler(ev?: KeyboardEvent): void {
    if (!ev) {
      this.moveTetromino(1, 0);
    } else {
      const key = ev.key;

      if (key === "a" || key === "ArrowLeft") {
        this.moveTetromino(0, -1);
      } else if (key === "d" || key === "ArrowRight") {
        this.moveTetromino(0, 1);
      } else if (key === "s" || key === "ArrowDown") {
        this.moveTetromino(1, 0);
      } else if (key === "w" || key === "ArrowUp") {
        this.rotateTetromino();
      } else if (key === " ") console.log("Not implemented drop");
      else {
        this.moveTetromino(1, 0);
      }
    }
  }

  public run() {
    this.drawTetromino();
    setInterval(this.tetrominoMoveHandler.bind(this), 1000);
    document.addEventListener("keydown", this.tetrominoMoveHandler.bind(this));
  }
}

// config
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_WIDTH = 24; /* similar to height */

const tetrominoTemplates: TetrominoTemplate[] = [
  {
    color: "red",
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  {
    color: "purple",
    shape: [
      [0, 2, 0],
      [2, 2, 2],
    ],
  },
  {
    color: "green",
    shape: [
      [0, 3, 3],
      [3, 3, 0],
    ],
  },
  {
    color: "yellow",
    shape: [
      [4, 4],
      [4, 4],
    ],
  },
  {
    color: "orange",
    shape: [
      [0, 0, 5],
      [5, 5, 5],
    ],
  },
  {
    color: "blue",
    shape: [
      [6, 0, 0],
      [6, 6, 6],
    ],
  },
  {
    color: "cyan",
    shape: [[7, 7, 7, 7]],
  },
];

const game = new Tetris(
  BOARD_WIDTH,
  BOARD_HEIGHT,
  BLOCK_WIDTH,
  tetrominoTemplates
);

game.run();
