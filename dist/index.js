"use strict";
// getting window el
const TETRIS_WINDOW_EL = document.querySelector(".tetris-window");
const TETRIS_WINDOW_RECT = TETRIS_WINDOW_EL.getBoundingClientRect();
// general width, height settings
const WINDOW_WIDTH = TETRIS_WINDOW_RECT.width;
const WINDOW_HEIGHT = TETRIS_WINDOW_RECT.height;
const CEIL_WIDTH = WINDOW_WIDTH / 10;
const CEIL_HEIGHT = WINDOW_HEIGHT / 20;
// tetromino templates
const TETROMINO_TEMPLATES = [
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
function getRandomTetrominoTemplate(tArray) {
    const index = Math.floor(Math.random() * tArray.length);
    return tArray[index];
}
function createRandomTetromino(tArray) {
    const tetrominoTemplate = getRandomTetrominoTemplate(tArray);
    const tetromino = document.createElement("div");
    tetromino.classList.add("tetromino");
    tetromino.style.height = (CEIL_HEIGHT * tetrominoTemplate.scheme.length).toString();
    tetromino.style.width = (CEIL_WIDTH * tetrominoTemplate.scheme[0].length).toString();
    console.log((CEIL_HEIGHT * tetrominoTemplate.scheme.length).toString(), tetromino.style.width = (CEIL_WIDTH * tetrominoTemplate.scheme[0].length).toString());
    for (let i = 0; i < tetrominoTemplate.scheme.length; i++) {
        for (let j = 0; j < tetrominoTemplate.scheme[i].length; j++) {
            const ceil = document.createElement("div");
            ceil.style.width = CEIL_WIDTH.toString();
            ceil.style.height = CEIL_HEIGHT.toString();
            if (tetrominoTemplate.scheme[i][j] === 1) {
                ceil.classList.add("full-ceil");
                ceil.style.backgroundColor = tetrominoTemplate.color;
            }
            else
                ceil.classList.add("empty-ceil");
            tetromino.appendChild(ceil);
        }
    }
    return tetromino;
}
TETRIS_WINDOW_EL.appendChild(createRandomTetromino(TETROMINO_TEMPLATES));
