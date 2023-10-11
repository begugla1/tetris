"use strict";
/** Class for game `Tetris` using `div` conatiner with `id  game-board`
 * to draw blocks and properly interact with user while playing.
 * P.S Doing this game i was inspired by one video from youtube  ^_^
 */
class Tetris {
    constructor(boardHeight, boardWidth, blockSize, downtime, tetrominoTemplates, musicAssets) {
        this.boardHeight = boardHeight;
        this.boardWidth = boardWidth;
        this.blockSize = blockSize;
        this.downTime = downtime;
        this.tetrominoTemplates = tetrominoTemplates;
        this.musicAssets = musicAssets;
        this.gameKeyHandler = this.keyGameEventListener.bind(this);
        this.mainClickHandler = this.mainEventListener.bind(this);
        document.addEventListener("keydown", this.mainClickHandler);
        this.toggleBgMusic();
    }
    /** Returns matrix using `boardHeight` attr like quantity of rows and `boardWidth`
     * attr like quantity of columns
     */
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
    /** Redraws html `div` container with game */
    redrawBoard() {
        document.getElementById("game-board").innerHTML = "";
        for (let r = 0; r < this.boardHeight; r++) {
            for (let c = 0; c < this.boardWidth; c++) {
                if (this.board[r][c]) {
                    this.drawBlock(this.board[r][c], r, c);
                }
            }
        }
    }
    /** Erase full rows if exists, returns quantity of affected rows */
    clearRows() {
        let clearRows = 0;
        for (let r = this.boardHeight - 1; r >= 0; r--) {
            let isRowFull = true;
            for (let c = 0; c < this.boardWidth; c++) {
                if (this.board[r][c] === "") {
                    isRowFull = false;
                    break;
                }
            }
            if (isRowFull) {
                clearRows += 1;
                for (let rr = r; rr > 0; rr--) {
                    for (let cc = 0; cc < this.boardWidth; cc++) {
                        this.board[rr][cc] = this.board[rr - 1][cc];
                    }
                }
                for (let i = 0; i < this.boardWidth; i++) {
                    this.board[0][i] = "";
                }
                r++;
            }
        }
        this.redrawBoard();
        return clearRows;
    }
    /** Returns rotated shape of given shape, doing rotation to clockwise on 90 degrees */
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
    /** Returns random tetromino using `tetrominoTemplates` attr to get random
     * tetromino template */
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
    /** Returns current ghost coordinates using `canGhostTetrominoMove` to determine
     * position for fixing
     */
    getGhostTetrominoCoords() {
        let row = this.CurrentTetromino.row;
        const col = this.CurrentTetromino.col;
        while (this.canGhostTetrominoMove(row, col)) {
            row++;
        }
        return [row, col];
    }
    /** Draws HTML block within game board with given params */
    drawBlock(color, row, col, className = "block") {
        var _a;
        const block = document.createElement("div");
        block.id = `block-${row}-${col}`;
        block.classList.add(className);
        block.style.top = this.blockSize * row + "px";
        block.style.left = this.blockSize * col + "px";
        block.style.backgroundColor = color;
        (_a = document.getElementById("game-board")) === null || _a === void 0 ? void 0 : _a.appendChild(block);
    }
    /** Erases block with given id */
    eraseBlock(blockId) {
        var _a;
        const block = document.getElementById(blockId);
        if (block)
            (_a = document.getElementById("game-board")) === null || _a === void 0 ? void 0 : _a.removeChild(block);
    }
    /** Returns boolean if tetromino can move with given increases,
     * if `isRotated` is true, then shape of tetromino for calculatings
     * will be replaced to rotated shape using `getRotatedShape` function
     */
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
    /** Determines if current ghost tetronimo can go down */
    canGhostTetrominoMove(row, col) {
        const shape = this.CurrentTetromino.shape;
        for (let r = 0; r < this.CurrentTetromino.shape.length; r++) {
            for (let c = 0; c < this.CurrentTetromino.shape[0].length; c++) {
                if (shape[r][c]) {
                    if (row + r + 1 >= this.boardHeight ||
                        this.board[row + r + 1][col + c] !== "") {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /** Returns boolean if tetromino can rotate using `canTetrominoRotate`
     * function
     */
    canTetrominoRotate() {
        return this.canTetrominoMove(0, 0, true);
    }
    /** Returns boolean if last fixed tetromino was losing tetromino */
    losingTetrominoIsSet() {
        for (let i = 0; i < this.boardWidth; i++) {
            if (this.board[0][i] !== "") {
                return true;
            }
        }
        return false;
    }
    /** Draws current Tetromino on the game board */
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
    /** Erases current Tetromino from the game board */
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
    /** Draw current ghost Tetronimo from the game board*/
    drawGhostTetromino() {
        const [row, col] = this.getGhostTetrominoCoords();
        const shape = this.CurrentTetromino.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[0].length; c++) {
                if (shape[r][c]) {
                    this.drawBlock("grey", row + r, col + c, "ghost-block");
                }
            }
        }
    }
    /** Erase current ghost Tetronimo from the game board*/
    eraseGhostTetromino() {
        const [row, col] = this.getGhostTetrominoCoords();
        const shape = this.CurrentTetromino.shape;
        for (let r = 0; r < shape.length; r++) {
            for (let c = 0; c < shape[0].length; c++) {
                if (shape[r][c]) {
                    this.eraseBlock(`block-${row + r}-${col + c}`);
                }
            }
        }
    }
    /** Checks if current tetromino can be rotated, if it does, rotate it  */
    rotateTetromino() {
        if (this.canTetrominoRotate()) {
            this.eraseGhostTetromino();
            this.eraseTetromino();
            this.CurrentTetromino.shape = this.getRotatedShape(this.CurrentTetromino.shape);
            this.drawGhostTetromino();
            this.drawTetromino();
        }
    }
    /** Fix tetromino on current position in `board` attr. Then
     * clear full rows, if they does. Finally, replace current tetromino on new one
     * and draw it
     */
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
        const rows = this.clearRows();
        console.log(rows); // TODO do something kinda off scores...?
        if (this.losingTetrominoIsSet()) {
            this.stopGame();
            return;
        }
        this.CurrentTetromino = this.getRandomTetromino();
        this.drawGhostTetromino();
        this.drawTetromino();
    }
    /** Drop current tetromino using current `col` coords of it */
    dropTetromino() {
        while (true) {
            if (!this.moveTetromino(1, 0)) {
                break;
            }
        }
    }
    /** Checks if current tetromino can move with given increases, if it does,
     * moves one to another coords with given increases and returns true, otherwise
     * checks in which direction was moving, if it goes down,
     * calls `fixTetromino` function to fix current tetromino, then returns false
     */
    moveTetromino(rowIncrease, colIncrease) {
        if (!this.canTetrominoMove(rowIncrease, colIncrease)) {
            if (rowIncrease === 1) {
                this.fixTetromino();
            }
            return false;
        }
        this.eraseGhostTetromino();
        this.eraseTetromino();
        this.CurrentTetromino.row += rowIncrease;
        this.CurrentTetromino.col += colIncrease;
        this.drawGhostTetromino();
        this.drawTetromino();
        return true;
    }
    /**
     * Event listener for all game key events, like rotation, falling, etc.
     */
    keyGameEventListener(ev) {
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
        else if (key === "ArrowDown" || key === "s") {
            this.moveTetromino(1, 0);
        }
        else if (key === " ") {
            this.dropTetromino();
        }
    }
    /** Event listener for rerunning game, toggling and changing music */
    mainEventListener(ev) {
        const key = ev.key;
        if (key === "Enter") {
            this.run();
        }
        else if (key === "m") {
            this.toggleBgMusic();
        }
        else if (key === "c") {
            this.changeBgMusic();
        }
    }
    /** Stops game and current interval function */
    stopGame() {
        clearInterval(this.GameIntervalId);
        document.removeEventListener("keydown", this.gameKeyHandler);
        console.log("You are lose!");
    }
    /** Toggle bg music */
    toggleBgMusic() {
        const music = document.querySelector("audio");
        if (music.paused) {
            music.play();
        }
        else {
            music.pause();
        }
    }
    /** Changes backgound music on next one in list, using regex to determine
     * current audio file. If you want to change music path, change this expression.
     * Important!!!!! - there should be start music for correct handling
     */
    changeBgMusic() {
        const regexp = /.+(?<=\/assets\/music\/)(.+)/;
        const music = document.querySelector("audio");
        music.pause();
        const regexpResult = regexp.exec(music.src);
        const currentMusicIndex = this.musicAssets.indexOf(regexpResult[1]);
        if (currentMusicIndex === this.musicAssets.length - 1) {
            music.src = music.src.replace(regexpResult[1], this.musicAssets[0]);
        }
        else {
            music.src = music.src.replace(regexpResult[1], this.musicAssets[currentMusicIndex + 1]);
        }
        music.play();
    }
    /** Main function. Clear board, current interval functon if it exists, draw start tetromino,
     * starts new one interval function and adds `keyGameEventListener` to interact with player
     */
    run() {
        clearInterval(this.GameIntervalId);
        this.board = this.getEmptyBoard();
        this.redrawBoard();
        this.CurrentTetromino = this.getRandomTetromino();
        this.drawGhostTetromino();
        this.drawTetromino();
        this.GameIntervalId = setInterval(this.moveTetromino.bind(this), this.downTime, 1, 0);
        document.addEventListener("keydown", this.gameKeyHandler);
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
const musicAssets = [
    "miamiDisco.mp3",
    "hotline.mp3",
    "hydrogen.mp3",
    "daisuke.mp3",
    "crystals.mp3",
];
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const BLOCK_SIZE = 24;
const game = new Tetris(BOARD_HEIGHT, BOARD_WIDTH, BLOCK_SIZE, 500, tetrominoTemplates, musicAssets);
game.run();
