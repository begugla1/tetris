"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// getting window el
const TETRIS_WINDOW_EL = document.querySelector(".tetris-window");
const TETRIS_WINDOW_RECT = TETRIS_WINDOW_EL.getBoundingClientRect();
const TETRIS_WINDOW_BORDER_WIDTH = 0;
// general width, height window-settings
const WINDOW_WIDTH = TETRIS_WINDOW_RECT.width - TETRIS_WINDOW_BORDER_WIDTH;
const WINDOW_HEIGHT = TETRIS_WINDOW_RECT.height - TETRIS_WINDOW_BORDER_WIDTH;
console.log(WINDOW_HEIGHT);
const CEIL_WIDTH = WINDOW_WIDTH / 10;
const CEIL_HEIGHT = WINDOW_HEIGHT / 20;
const CEIL_BORDER_WIDTH = 5;
let lastID = 0;
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
    lastID += 1;
    tetromino.id = lastID.toString();
    for (let i = 0; i < tetrominoTemplate.scheme.length; i++) {
        for (let j = 0; j < tetrominoTemplate.scheme[i].length; j++) {
            const ceil = document.createElement("div");
            ceil.style.cssText += getCSSProperty("width", CEIL_WIDTH - CEIL_BORDER_WIDTH * 2, "px");
            ceil.style.cssText += getCSSProperty("height", CEIL_HEIGHT - CEIL_BORDER_WIDTH * 2, "px");
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
function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
function updateCurrentTetrominoPosition() {
    const regex = new RegExp(/\d*/);
    const currentTetromino = document.getElementById(lastID.toString());
    let currentPadding = regex.exec(currentTetromino.style.paddingTop)[0];
    if (currentPadding === "")
        currentPadding = 0;
    else
        currentPadding = Number(currentPadding);
    currentTetromino.style.paddingTop = `${currentPadding + CEIL_HEIGHT}px`;
    console.log("go out");
}
function drawCurrentTetromino() {
    return __awaiter(this, void 0, void 0, function* () {
        TETRIS_WINDOW_EL.appendChild(createRandomTetromino(TETROMINO_TEMPLATES));
        for (let i = 1; i < 20; i++) {
            yield sleep(200);
            updateCurrentTetrominoPosition();
        }
    });
}
drawCurrentTetromino();
/*капзда*/ 
