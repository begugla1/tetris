"use strict";
class Tetris {
    constructor(boardHeight, boardWidth, blockSize, tetrominoTemplates) {
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.blockSize = blockSize;
        this.tetrominoTemplates = tetrominoTemplates;
        this.CurrentTetromino = this.getRandomTetromino();
        this.board = this.getEmptyBoard();
        this.drawTetromino();
        setInterval(this.moveTetromino.bind(this), 1000, 1, 0);
        document.addEventListener("keydown", this.keyEventIstener.bind(this));
    }
    getEmptyBoard() {
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
    getRotatedShape(shape) {
        const rotatedShape = [];
        console.log(shape);
        console.log(shape[0]);
        for (let i = 0; i < shape[0].length; i++) {
            const rotatedRow = [];
            for (let j = shape.length - 1; j >= 0; j--) {
                console.log(j, i);
                rotatedRow.push(shape[j][i]);
            }
            rotatedShape.push(rotatedRow);
        }
        console.log(rotatedShape);
        return rotatedShape;
    }
    getRandomTetromino() {
        const tetrominoTemplateIndex = Math.floor(Math.random() * this.tetrominoTemplates.length);
        const tetrominoTemplate = this.tetrominoTemplates[tetrominoTemplateIndex];
        return {
            color: tetrominoTemplate.color,
            shape: tetrominoTemplate.shape,
            row: 0,
            col: Math.floor(Math.random() *
                (this.boardWidth - tetrominoTemplate.shape[0].length + 1)),
        };
    }
    drawBlock(color, row, col) {
        var _a;
        const block = document.createElement("div");
        block.id = `block-${row}-${col}`;
        block.classList.add("block");
        block.style.top = this.blockSize * row + "px";
        block.style.left = this.blockSize * col + "px";
        block.style.backgroundColor = color;
        (_a = document.getElementById("game-board")) === null || _a === void 0 ? void 0 : _a.appendChild(block);
    }
    eraseBlock(blockId) {
        var _a;
        const block = document.getElementById(blockId);
        if (block)
            (_a = document.getElementById("game-board")) === null || _a === void 0 ? void 0 : _a.removeChild(block);
    }
    drawTetromino() {
        const tetromino = this.CurrentTetromino;
        for (let r = 0; r < tetromino.shape.length; r++) {
            for (let c = 0; c < tetromino.shape[0].length; c++) {
                if (this.CurrentTetromino.shape[r][c]) {
                    this.drawBlock(tetromino.color, tetromino.row + r, tetromino.col + c);
                }
            }
        }
    }
    eraseTetromino() {
        for (let r = 0; r < this.CurrentTetromino.shape.length; r++) {
            for (let c = 0; c < this.CurrentTetromino.shape[0].length; c++) {
                if (this.CurrentTetromino.shape[r][c]) {
                    const blockId = `block-${this.CurrentTetromino.row + r}-${this.CurrentTetromino.col + c}`;
                    this.eraseBlock(blockId);
                }
            }
        }
    }
    rotateTetromino() {
        this.eraseTetromino();
        this.CurrentTetromino.shape = this.getRotatedShape(this.CurrentTetromino.shape);
        this.drawTetromino();
    }
    canTetrominoMove(rowIncrease, colIncrease, isRotated = false) {
        let currentShape = this.CurrentTetromino.shape;
        if (isRotated) {
            currentShape = this.getRotatedShape(this.CurrentTetromino.shape);
        }
        for (let r = 0; r < currentShape.length; r++) {
            for (let c = 0; c < currentShape[0].length; c++) {
                if (this.CurrentTetromino.shape[r][c]) {
                    const row = this.CurrentTetromino.row + r + rowIncrease;
                    const col = this.CurrentTetromino.col + c + colIncrease;
                    if (row >= this.boardHeight ||
                        row < 0 ||
                        col >= this.boardWidth ||
                        col < 0 ||
                        (row >= 0 && col >= 0 && this.board[row][col] !== "")) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    moveTetromino(rowIncrease, colIncrease, checkColissions = true) {
        if (checkColissions) {
            if (!this.canTetrominoMove(rowIncrease, colIncrease))
                return;
        }
        this.eraseTetromino();
        this.CurrentTetromino.row += rowIncrease;
        this.CurrentTetromino.col += colIncrease;
        this.drawTetromino();
    }
    keyEventIstener(ev) {
        const key = ev.key;
        if (key === "ArrowLeft") {
            this.moveTetromino(0, -1);
        }
        else if (key === "ArrowRight") {
            this.moveTetromino(0, 1);
        }
        else if (key === "ArrowUp") {
            if (this.canTetrominoMove(0, 0, true))
                this.rotateTetromino();
        }
        else {
            if (this.canTetrominoMove(1, 0))
                this.moveTetromino(1, 0, false);
            else
                console.log("Need to be fixed!!!");
        }
    }
}
const tetrominoTemplates = [
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
const game = new Tetris(BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, tetrominoTemplates);
