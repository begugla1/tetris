// getting window el
const TETRIS_WINDOW_EL = document.querySelector(".tetris-window")!;
const TETRIS_WINDOW_RECT = TETRIS_WINDOW_EL.getBoundingClientRect();

// general width, height settings
const WINDOW_WIDTH = TETRIS_WINDOW_RECT.width;
const WINDOW_HEIGHT = TETRIS_WINDOW_RECT.height;

const CEIL_WIDTH = WINDOW_WIDTH / 10;
const CEIL_HEIGHT = WINDOW_HEIGHT / 20;

let lastID = 1;

interface Tetromino {
  color: string;
  scheme: number[][];
}

// tetromino templates
const TETROMINO_TEMPLATES: Tetromino[] = [
  {
    color: "cyan",
    scheme: [[1, 1, 1, 1]],
  },
  {
    color: "blue",
    scheme: [
      [1, 0, 0],
      [1, 1, 1],
    ],
  },
  {
    color: "orange",
    scheme: [
      [0, 0, 1],
      [1, 1, 1],
    ],
  },
  {
    color: "yellow",
    scheme: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    color: "green",
    scheme: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  {
    color: "purple",
    scheme: [
      [0, 1, 0],
      [1, 1, 1],
    ],
  },
  {
    color: "red",
    scheme: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
];

function getCSSProperty(key: string, value: string | number, measure?: string): string {
  return `${key}:${value}${measure ? measure : ""};`
}

function getRandomTetrominoTemplate(tArray: Tetromino[]): Tetromino {
  const index = Math.floor(Math.random() * tArray.length);
  return tArray[index];
}

function createRandomTetromino(tArray: Tetromino[]): HTMLElement {
  const tetrominoTemplate = getRandomTetrominoTemplate(tArray);

  const tetromino = document.createElement("div");
  tetromino.classList.add("tetromino");
  tetromino.style.cssText += getCSSProperty("height", CEIL_HEIGHT * tetrominoTemplate.scheme.length, "px")
  tetromino.style.cssText += getCSSProperty("width", CEIL_WIDTH * tetrominoTemplate.scheme[0].length, "px")
  tetromino.id = lastID.toString()

  for (let i = 0; i < tetrominoTemplate.scheme.length; i++) {
    for (let j = 0; j < tetrominoTemplate.scheme[i].length; j++) {
      const ceil = document.createElement("div");
      ceil.style.cssText += getCSSProperty("width", CEIL_WIDTH - 10, "px")
      ceil.style.cssText += getCSSProperty("height", CEIL_HEIGHT - 10, "px")
      if (tetrominoTemplate.scheme[i][j] === 1) {
        ceil.classList.add("full-ceil");
        ceil.style.cssText += getCSSProperty("background-color", tetrominoTemplate.color);
        ceil.style.cssText += getCSSProperty("border-color", tetrominoTemplate.color);
      } else ceil.classList.add("empty-ceil");
      tetromino.appendChild(ceil);
    }
  }
  lastID += 1
  return tetromino;
}

TETRIS_WINDOW_EL.appendChild(createRandomTetromino(TETROMINO_TEMPLATES));
