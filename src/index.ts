// config
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_WIDTH = 24; /* similar to height */

const BOARD: number[][] = (function () {
  const board = [];
  for (let i = 0; i < BOARD_HEIGHT; i++) {
    const row = [];
    for (let j = 0; j < BLOCK_WIDTH; j++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
})();

interface TetrominoTemplate {
  color: string;
  shape: number[][];
}

interface Tetromino extends TetrominoTemplate {
  row: number;
  col: number;
}

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

function getTetromino(): Tetromino {
  const index = Math.floor(Math.random() * tetrominoTemplates.length);
  const tetrominoTemplate = tetrominoTemplates[index];
  const row = 0;
  const col = Math.floor(
    Math.random() * (BOARD_WIDTH - tetrominoTemplate.shape[0].length + 1)
  );
  return {
    color: tetrominoTemplate.color,
    shape: tetrominoTemplate.shape,
    row: row,
    col: col,
  };
}

let currentTetromino = getTetromino();
let ghostTetromino = currentTetromino;

function drawTetromino(): void {
  const board = document.getElementById("tetris-window");
  console.log(board);
  for (let r = 0; r < currentTetromino.shape.length; r++) {
    for (let c = 0; c < currentTetromino.shape[0].length; c++) {
      if (currentTetromino.shape[r][c] !== 0) {
        const row = currentTetromino.row;
        const col = currentTetromino.col;
        const block = document.createElement("div");
        block.classList.add(
          "block",
          "tb-classic"
        ); /* you must define any style class for block!! (e.g) `tb-classic` */
        block.id = `block-${row + r}-${col + c}`;
        block.style.top = (row + r) * BLOCK_WIDTH + "px";
        block.style.left = (col + c) * BLOCK_WIDTH + "px";
        block.style.backgroundColor = currentTetromino.color;
        board?.appendChild(block);
      }
    }
  }
}

function eraseTetromino(): void {
  for (let r = 0; r < currentTetromino.shape.length; r++) {
    for (let c = 0; c < currentTetromino.shape[0].length; c++) {
      if (currentTetromino.shape[r][c] !== 0) {
        const row = currentTetromino.row;
        const col = currentTetromino.col;
        const block = document.getElementById(`block-${row + r}-${col + c}`);
        if (block) document.getElementById("tetris-window")?.removeChild(block);
      }
    }
  }
}

function moveTetromino(rowIncrease: number, colIncrease: number): void {
  if (canTetrominoMove(rowIncrease, colIncrease)) {
    eraseTetromino();
    currentTetromino.row += rowIncrease;
    currentTetromino.col += colIncrease;
    drawTetromino();
  }
}

function getRotatedShape(shape: number[][]): number[][] {
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

function rotateTetromino(): void {
  if (canTetrominoMove(0, 0, true)) {
    eraseTetromino();
    currentTetromino.shape = getRotatedShape(currentTetromino.shape);
    drawTetromino();
  }
}

function canTetrominoMove(
  rowOffset: number,
  colOffset: number,
  isRotated?: boolean
): boolean {
  let shape: number[][];
  if (isRotated) shape = getRotatedShape(currentTetromino.shape);
  else shape = currentTetromino.shape;
  for (let r = 0; r < shape.length; r++) {
    for (let c = 0; c < shape[0].length; c++) {
      if (shape[r][c] !== 0) {
        const row = currentTetromino.row + r + rowOffset;
        const col = currentTetromino.col + c + colOffset;
        if (
          row >= BOARD_HEIGHT ||
          row < 0 ||
          col >= BOARD_WIDTH ||
          col < 0 ||
          BOARD[row][col] !== 0
        )
          return false;
      }
    }
  }
  return true;
}

drawTetromino();
setInterval(moveTetromino, 1000, 1, 0);
document.addEventListener("keydown", tetrominoKeyHandler);

function tetrominoKeyHandler(event: KeyboardEvent): void {
  const key = event.key;

  if (key === "a" || key === "ArrowLeft") {
    moveTetromino(0, -1);
  } else if (key === "d" || key === "ArrowRight") {
    moveTetromino(0, 1);
  } else if (key === "s" || key === "ArrowDown") {
    moveTetromino(1, 0);
  } else if (key === "w" || key === "ArrowUp") {
    rotateTetromino();
  } else if (key === " ") console.log("Not implemented drop");
  else {
    moveTetromino(1, 0);
  }
}
