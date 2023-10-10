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
    getRandomTetromino() {
        const tetrominoTemplateIndex = Math.floor(Math.random() * this.tetrominoTemplates.length);
        const tetrominoTemplate = this.tetrominoTemplates[tetrominoTemplateIndex];
        return {
            color: tetrominoTemplate.color,
            shape: tetrominoTemplate.shape,
            row: 0,
            col: Math.floor(Math.random() * (this.boardWidth - tetrominoTemplate.shape[0].length + 1)),
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
    drawTetromino() {
        const tetromino = this.CurrentTetromino;
        for (let r = 0; r < tetromino.shape.length; r++) {
            for (let c = 0; c < tetromino.shape[0].length; c++) {
                this.drawBlock(tetromino.color, tetromino.row + r, tetromino.col + c);
            }
        }
    }
    moveTetromino(rowIncrease, colIncrease, isRotated) {
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
