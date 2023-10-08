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
function getCSSProperty(key, value, measure) {
    return `${key}:${value}${measure ? measure : ""};`;
}
function getRandomTetrominoTemplate(tArray) {
    const index = Math.floor(Math.random() * tArray.length);
    return tArray[index];
}
function createRandomTetromino(tArray) {
    const tetrominoTemplate = getRandomTetrominoTemplate(tArray);
    const tetromino = document.createElement("div");
    tetromino.classList.add("tetromino");
    tetromino.style.cssText += getCSSProperty("height", CEIL_HEIGHT * tetrominoTemplate.scheme.length, "px");
    tetromino.style.cssText += getCSSProperty("width", CEIL_WIDTH * tetrominoTemplate.scheme[0].length, "px");
    for (let i = 0; i < tetrominoTemplate.scheme.length; i++) {
        for (let j = 0; j < tetrominoTemplate.scheme[i].length; j++) {
            const ceil = document.createElement("div");
            ceil.style.cssText += getCSSProperty("width", CEIL_WIDTH - 10, "px");
            ceil.style.cssText += getCSSProperty("height", CEIL_HEIGHT - 10, "px");
            if (tetrominoTemplate.scheme[i][j] === 1) {
                ceil.classList.add("full-ceil");
                ceil.style.cssText += getCSSProperty("background-color", tetrominoTemplate.color);
                ceil.style.cssText += getCSSProperty("border-color", tetrominoTemplate.color);
            }
            else
                ceil.classList.add("empty-ceil");
            tetromino.appendChild(ceil);
        }
    }
    return tetromino;
}
TETRIS_WINDOW_EL.appendChild(createRandomTetromino(TETROMINO_TEMPLATES));
