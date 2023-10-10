interface TetrominoTemplate {
  color: string;
  shape: number[][];
}

interface Tetromino extends TetrominoTemplate {
  row: number;
  col: number;
}

type Board = string[][];

class Tetris {
  boardHeight: number;
  boardWidth: number;
  blockSize: number;
  board: Board;
  tetrominoTemplates: TetrominoTemplate[];
  CurrentTetromino: Tetromino;

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
    this.CurrentTetromino = this.getRandomTetromino();
    this.board = this.getEmptyBoard();
    this.drawTetromino();
  }

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
        Math.random() * (this.boardWidth - tetrominoTemplate.shape[0].length + 1)
      ),
    };
  }

  private drawBlock(color: string, row: number, col: number): void {
    const block = document.createElement("div");
    block.id = `block-${row}-${col}`;
    block.classList.add("block");
    block.style.top = this.blockSize * row + "px";
    block.style.left = this.blockSize * col + "px";
    block.style.backgroundColor = color;

    document.getElementById("game-board")?.appendChild(block);
  }

  private drawTetromino(): void {
    const tetromino = this.CurrentTetromino;
    for (let r = 0; r < tetromino.shape.length; r++) {
      for (let c = 0; c < tetromino.shape[0].length; c++) {
        this.drawBlock(tetromino.color, tetromino.row + r, tetromino.col + c);
      }
    }
  }

  private moveTetromino(rowIncrease: number, colIncrease: number, isRotated?: boolean): void {
    
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
    BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, tetrominoTemplates
)
