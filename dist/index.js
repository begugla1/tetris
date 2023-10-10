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
    redrawBoard() {
        for (let r = 0; r < this.boardHeight; r++) {
            for (let c = 0; c < this.boardWidth; c++) {
                if (this.board[r][c]) {
                    this.drawBlock(this.board[r][c], r, c);
                }
            }
        }
    }
    getRotatedShape(shape) {
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
    canTetrominoMove(rowIncrease, colIncrease, isRotated = false) {
        let currentShape = this.CurrentTetromino.shape;
        if (isRotated) {
            currentShape = this.getRotatedShape(this.CurrentTetromino.shape);
        }
        for (let r = 0; r < currentShape.length; r++) {
            for (let c = 0; c < currentShape[0].length; c++) {
                if (currentShape[r][c]) {
                    const row = this.CurrentTetromino.row + r + rowIncrease;
                    const col = this.CurrentTetromino.col + c + colIncrease;
                    if (row >= this.boardHeight ||
                        row < 0 ||
                        col >= this.boardWidth ||
                        col < 0 ||
                        (row >= 0 &&
                            row < this.boardHeight &&
                            col >= 0 &&
                            col < this.boardWidth &&
                            this.board[row][col] !== "")) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    canTetrominoRotate() {
        return this.canTetrominoMove(0, 0, true);
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
        const tetromino = this.CurrentTetromino;
        for (let r = 0; r < tetromino.shape.length; r++) {
            for (let c = 0; c < tetromino.shape[0].length; c++) {
                if (this.CurrentTetromino.shape[r][c]) {
                    const blockId = `block-${this.CurrentTetromino.row + r}-${this.CurrentTetromino.col + c}`;
                    this.eraseBlock(blockId);
                }
            }
        }
    }
    rotateTetromino() {
        if (this.canTetrominoRotate()) {
            this.eraseTetromino();
            this.CurrentTetromino.shape = this.getRotatedShape(this.CurrentTetromino.shape);
            this.drawTetromino();
        }
    }
    fixTetromino() {
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
        this.CurrentTetromino = this.getRandomTetromino();
        this.drawTetromino();
    }
    dropTetromino() {
        while (true) {
            if (!this.moveTetromino(1, 0)) {
                break;
            }
        }
    }
    moveTetromino(rowIncrease, colIncrease) {
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
    keyEventIstener(ev) {
        const key = ev.key;
        if (key === "ArrowLeft" || key === "a") {
            this.moveTetromino(0, -1);
        }
        else if (key === "ArrowRight" || key === "d") {
            this.moveTetromino(0, 1);
        }
        else if (key === "ArrowUp" || key === "w") {
            this.rotateTetromino();
        }
        else if (key === " ") {
            this.dropTetromino();
        }
        else {
            this.moveTetromino(1, 0);
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
