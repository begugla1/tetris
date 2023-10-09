"use strict";
// config
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_WIDTH = 24; /* similar to height */
const Board = (function () {
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
const tetrominoTemplates = [
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
function getRandomTetromino() {
    const index = Math.floor(Math.random() * tetrominoTemplates.length);
    const tetrominoTemplate = tetrominoTemplates[index];
    const row = 0;
    const col = Math.floor(Math.random() * (BOARD_WIDTH - tetrominoTemplate.shape[0].length + 1));
    return {
        color: tetrominoTemplate.color,
        shape: tetrominoTemplate.shape,
        row: row,
        col: col,
    };
}
let currentTetromino = getRandomTetromino();
let ghostTetromino = currentTetromino;
function drawTetromino() {
    const board = document.getElementById("tetris-window");
    console.log(board);
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[0].length; c++) {
            if (currentTetromino.shape[r][c] !== 0) {
                const row = currentTetromino.row;
                const col = currentTetromino.col;
                const block = document.createElement("div");
                block.classList.add("block");
                block.id = `block-${row + r}-${col + c}`;
                block.style.top = (row + r) * BLOCK_WIDTH + "px";
                block.style.left = (col + c) * BLOCK_WIDTH + "px";
                block.style.backgroundColor = currentTetromino.color;
                board === null || board === void 0 ? void 0 : board.appendChild(block);
            }
        }
    }
}
function eraseTetromino() {
    var _a;
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[0].length; c++) {
            if (currentTetromino.shape[r][c] !== 0) {
                const row = currentTetromino.row;
                const col = currentTetromino.col;
                const block = document.getElementById(`block-${row + r}-${col + c}`);
                if (block)
                    (_a = document.getElementById("tetris-window")) === null || _a === void 0 ? void 0 : _a.removeChild(block);
            }
        }
    }
}
function moveTetromino({ row, col }) {
    eraseTetromino();
    currentTetromino.row += row;
    currentTetromino.col += col;
    drawTetromino();
}
drawTetromino();
setInterval(moveTetromino, 1000, { row: 1, col: 0 });
