"use strict";
// config
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_WIDTH = 24; /* similar to height */
const BOARD = (function () {
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
function getTetromino() {
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
let currentTetromino = getTetromino();
let ghostTetromino = currentTetromino;
function drawTetromino() {
    const board = document.getElementById("tetris-window");
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[0].length; c++) {
            if (currentTetromino.shape[r][c] !== 0) {
                const row = currentTetromino.row;
                const col = currentTetromino.col;
                const block = document.createElement("div");
                block.classList.add("block", "tb-classic"); /* you must define any style class for block!! (e.g) `tb-classic` */
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
function fixTetromino() {
    for (let r = 0; r < currentTetromino.shape.length; r++) {
        for (let c = 0; c < currentTetromino.shape[0].length; c++) {
            if (currentTetromino.shape[r][c] !== 0) {
                const row = currentTetromino.row + r;
                const col = currentTetromino.col + c;
                if (BOARD[row][col] !== null)
                    BOARD[row][col] = currentTetromino.shape[r][c];
            }
        }
    }
    currentTetromino = getTetromino();
    ghostTetromino = currentTetromino;
    drawTetromino();
}
function getRotatedShape(shape) {
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
function rotateTetromino() {
    if (canTetrominoMove(0, 0, true)) {
        eraseTetromino();
        currentTetromino.shape = getRotatedShape(currentTetromino.shape);
        drawTetromino();
    }
}
function canTetrominoMove(rowOffset, colOffset, isRotated) {
    let shape;
    if (isRotated)
        shape = getRotatedShape(currentTetromino.shape);
    else
        shape = currentTetromino.shape;
    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[0].length; c++) {
            if (shape[r][c] !== 0) {
                const row = currentTetromino.row + r + rowOffset;
                const col = currentTetromino.col + c + colOffset;
                if (row >= BOARD_HEIGHT ||
                    row < 0 ||
                    col >= BOARD_WIDTH ||
                    col < 0 ||
                    BOARD[row][col] !== 0)
                    return false;
            }
        }
    }
    return true;
}
function moveTetromino(rowIncrease, colIncrease) {
    if (canTetrominoMove(rowIncrease, colIncrease)) {
        eraseTetromino();
        currentTetromino.row += rowIncrease;
        currentTetromino.col += colIncrease;
        drawTetromino();
        if (rowIncrease === 1 && !canTetrominoMove(rowIncrease, colIncrease))
            fixTetromino();
    }
}
drawTetromino();
setInterval(tetrominoMoveHandler, 1000);
document.addEventListener("keydown", tetrominoMoveHandler);
function tetrominoMoveHandler(event) {
    if (!event) {
        moveTetromino(1, 0);
    }
    else {
        const key = event.key;
        if (key === "a" || key === "ArrowLeft") {
            moveTetromino(0, -1);
        }
        else if (key === "d" || key === "ArrowRight") {
            moveTetromino(0, 1);
        }
        else if (key === "s" || key === "ArrowDown") {
            moveTetromino(1, 0);
        }
        else if (key === "w" || key === "ArrowUp") {
            rotateTetromino();
        }
        else if (key === " ")
            console.log("Not implemented drop");
        else {
            if (canTetrominoMove(1, 0)) {
                moveTetromino(1, 0);
            }
            else {
                console.log("Hello");
            }
        }
    }
}
