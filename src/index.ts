interface TetrominoTemplate {
  color: string;
  shape: number[][];
}

interface Tetromino extends TetrominoTemplate {
  row: number;
  col: number;
}

type Board = string[][];

/** Class for game `Tetris` using `div` conatiner with `id  game-board`
 * to draw blocks and properly interact with user while playing.
 * P.S game is pretty simple, but pretty ^_^ (in my opinion)
 */
class Tetris {
  boardHeight: number;
  boardWidth: number;
  blockSize: number;
  tetrominoTemplates: TetrominoTemplate[];
  gameKeyHandler: (ev: KeyboardEvent) => void;
  mainClickHandler: () => void;
  board!: Board;
  CurrentTetromino!: Tetromino;
  GameIntervalId?: NodeJS.Timeout;

  constructor(
    boardHeight: number,
    boardWidth: number,
    blockSize: number,
    tetrominoTemplates: TetrominoTemplate[]
  ) {
    this.boardHeight = boardHeight;
    this.boardWidth = boardWidth;
    this.blockSize = blockSize;
    this.tetrominoTemplates = tetrominoTemplates;
    this.gameKeyHandler = this.keyGameEventListener.bind(this);
    this.mainClickHandler = this.mainEventListener.bind(this);
    document.addEventListener("click", this.mainClickHandler);
  }

  /** returns matrix using `boardHeight` attr like quantity of rows and `boardWidth` attr
   *  like quantity of columns
   */
  private getEmptyBoard(): Board {
    const board = [];
    for (let i = 0; i < this.boardHeight; i++) {
      const row = [];
      for (let j = 0; j < this.boardWidth; j++) {
        row.push("");
      }
      board.push(row);
    }
    return board;
  }

  /** redraws html `div` container with game */
  private redrawBoard(): void {
    document.getElementById("game-board")!.innerHTML = "";
    for (let r = 0; r < this.boardHeight; r++) {
      for (let c = 0; c < this.boardWidth; c++) {
        if (this.board[r][c]) {
          this.drawBlock(this.board[r][c], r, c);
        }
      }
    }
  }

  /** returns rotated shape of given shape, doing rotation to clockwise on 90 degrees */
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

  /** returns random tetromino using `tetrominoTemplates` attr to get random
   * tetromino template */
  private getRandomTetromino(): Tetromino {
    const tetrominoTemplateIndex = Math.floor(
      Math.random() * this.tetrominoTemplates.length
    );
    const tetrominoTemplate = this.tetrominoTemplates[tetrominoTemplateIndex];
    return {
      color: tetrominoTemplate.color,
      shape: tetrominoTemplate.shape,
      row: 0,
      col: Math.floor(
        Math.random() *
          (this.boardWidth - tetrominoTemplate.shape[0].length + 1)
      ),
    };
  }

  /** draws HTML block within game board with given params */
  private drawBlock(color: string, row: number, col: number): void {
    const block = document.createElement("div");
    block.id = `block-${row}-${col}`;
    block.classList.add("block");
    block.style.top = this.blockSize * row + "px";
    block.style.left = this.blockSize * col + "px";
    block.style.backgroundColor = color;

    document.getElementById("game-board")?.appendChild(block);
  }

  /** erases block with given id */
  private eraseBlock(blockId: string): void {
    const block = document.getElementById(blockId);
    if (block) document.getElementById("game-board")?.removeChild(block);
  }

  private canTetrominoMove(
    rowIncrease: number,
    colIncrease: number,
    isRotated: boolean = false
  ): boolean {
    let currentShape = this.CurrentTetromino.shape;
    if (isRotated) {
      currentShape = this.getRotatedShape(this.CurrentTetromino.shape);
    }
    for (let r = 0; r < currentShape.length; r++) {
      for (let c = 0; c < currentShape[0].length; c++) {
        if (currentShape[r][c]) {
          const row = this.CurrentTetromino.row + r + rowIncrease;
          const col = this.CurrentTetromino.col + c + colIncrease;
          if (
            row >= this.boardHeight ||
            row < 0 ||
            col >= this.boardWidth ||
            col < 0 ||
            (row >= 0 &&
              row < this.boardHeight &&
              col >= 0 &&
              col < this.boardWidth &&
              this.board[row][col] !== "")
          ) {
            return false;
          }
        }
      }
    }
    return true;
  }

  private canTetrominoRotate(): boolean {
    return this.canTetrominoMove(0, 0, true);
  }

  private losingTetrominoIsSet(): boolean {
    for (let i = 0; i < this.boardWidth; i++) {
      if (this.board[0][i] !== "") {
        return true;
      }
    }
    return false;
  }

  private drawTetromino(): void {
    const tetromino = this.CurrentTetromino;
    for (let r = 0; r < tetromino.shape.length; r++) {
      for (let c = 0; c < tetromino.shape[0].length; c++) {
        if (this.CurrentTetromino.shape[r][c]) {
          this.drawBlock(tetromino.color, tetromino.row + r, tetromino.col + c);
        }
      }
    }
  }

  private eraseTetromino(): void {
    const tetromino = this.CurrentTetromino;
    for (let r = 0; r < tetromino.shape.length; r++) {
      for (let c = 0; c < tetromino.shape[0].length; c++) {
        if (this.CurrentTetromino.shape[r][c]) {
          const blockId = `block-${this.CurrentTetromino.row + r}-${
            this.CurrentTetromino.col + c
          }`;
          this.eraseBlock(blockId);
        }
      }
    }
  }

  private rotateTetromino(): void {
    if (this.canTetrominoRotate()) {
      this.eraseTetromino();
      this.CurrentTetromino.shape = this.getRotatedShape(
        this.CurrentTetromino.shape
      );
      this.drawTetromino();
    }
  }

  private fixTetromino(): void {
    const tetromino = this.CurrentTetromino;
    for (let r = 0; r < tetromino.shape.length; r++) {
      for (let c = 0; c < tetromino.shape[0].length; c++) {
        if (tetromino.shape[r][c]) {
          const row = tetromino.row + r;
          const col = tetromino.col + c;
          this.board[row][col] = tetromino.color;
        }
      }
    }
    //FIXME There should be clearing of rows
    if (this.losingTetrominoIsSet()) {
      this.stopGame();
      return;
    }
    this.CurrentTetromino = this.getRandomTetromino();
    this.drawTetromino();
  }

  private dropTetromino(): void {
    while (true) {
      if (!this.moveTetromino(1, 0)) {
        break;
      }
    }
  }

  /** Checks if current tetromino can move with given increases, if it does,
   * moves one to another coords with given increases and returns true, otherwise
   * checks in which direction was moving, if it goes down,
   * calls `fixTetromino` function to fix current tetromino, then returns false
   */
  private moveTetromino(rowIncrease: number, colIncrease: number): boolean {
    if (!this.canTetrominoMove(rowIncrease, colIncrease)) {
      if (rowIncrease > 0) {
        this.fixTetromino();
      }
      return false;
    }
    this.eraseTetromino();
    this.CurrentTetromino.row += rowIncrease;
    this.CurrentTetromino.col += colIncrease;
    this.drawTetromino();
    return true;
  }

  /**
   * event listener for all game key events
   */
  private keyGameEventListener(ev: KeyboardEvent): void {
    const key = ev.key;
    if (key === "ArrowLeft" || key === "a") {
      this.moveTetromino(0, -1);
    } else if (key === "ArrowRight" || key === "d") {
      this.moveTetromino(0, 1);
    } else if (key === "ArrowUp" || key === "w") {
      this.rotateTetromino();
    } else if (key === "ArrowDown" || key === "s") {
      this.moveTetromino(1, 0);
    } else if (key === " ") {
      this.dropTetromino();
    }
  }

  /** event listener which after mouse clicking envoke `run` function to start game */
  private mainEventListener(): void {
    this.run();
  }

  /** stops game and current interval function */
  private stopGame() {
    clearInterval(this.GameIntervalId);
    document.removeEventListener("keydown", this.gameKeyHandler);
    console.log("You are lose!");
  }

  /** main function. clear board, current interval functon if it exists, draw start tetromino,
   * starts new one interval function and adds `keyGameEventListener` to interact with game
   */
  public run() {
    clearInterval(this.GameIntervalId);
    this.board = this.getEmptyBoard();
    this.redrawBoard();
    this.CurrentTetromino = this.getRandomTetromino();
    this.drawTetromino();
    this.GameIntervalId = setInterval(
      this.moveTetromino.bind(this),
      1000,
      1,
      0
    );
    document.addEventListener("keydown", this.gameKeyHandler);
  }
}

const tetrominoTemplates: TetrominoTemplate[] = [
  {
    color: "cyan",
    shape: [[1, 1, 1, 1]],
  },
  {
    color: "blue",
    shape: [
      [2, 0, 0],
      [2, 2, 2],
    ],
  },
  {
    color: "orange",
    shape: [
      [0, 0, 3],
      [3, 3, 3],
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
    color: "green",
    shape: [
      [0, 5, 5],
      [5, 5, 0],
    ],
  },
  {
    color: "purple",
    shape: [
      [0, 6, 0],
      [6, 6, 6],
    ],
  },
  {
    color: "red",
    shape: [
      [7, 7, 0],
      [0, 7, 7],
    ],
  },
];

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 24;

const game = new Tetris(
  BOARD_HEIGHT,
  BOARD_WIDTH,
  BLOCK_SIZE,
  tetrominoTemplates
);

game.run();
