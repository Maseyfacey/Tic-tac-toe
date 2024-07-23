const boardElement = document.getElementById('board');
const resetButton = document.getElementById('resetButton');
let board = {};
let currentTurn = 'X';

function createBoard() {
    boardElement.innerHTML = '';
    for (let y = -10; y <= 10; y++) {
        for (let x = -10; x <= 10; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = x;
            cell.dataset.y = y;
            cell.addEventListener('click', playerMove);
            boardElement.appendChild(cell);
        }
    }
}

function playerMove(event) {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    if (makeMove(x, y, currentTurn)) {
        if (checkWinner() || Object.keys(board).length === 441) {
            return;
        }
        aiMove();
    }
}

function makeMove(x, y, player) {
    if (board[`${x},${y}`]) {
        alert('This position is already taken. Try another one.');
        return false;
    }
    board[`${x},${y}`] = player;
    document.querySelector(`.cell[data-x="${x}"][data-y="${y}"]`).innerText = player;
    currentTurn = player === 'X' ? 'O' : 'X';
    return true;
}

function aiMove() {
    let bestScore = -Infinity;
    let bestMove;
    for (let y = -10; y <= 10; y++) {
        for (let x = -10; x <= 10; x++) {
            if (!board[`${x},${y}`]) {
                board[`${x},${y}`] = 'O';
                let score = minimax(board, 0, false);
                delete board[`${x},${y}`];
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = { x, y };
                }
            }
        }
    }
    makeMove(bestMove.x, bestMove.y, 'O');
    checkWinner();
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result === 'X' ? -1 : 1;
    }
    if (Object.keys(board).length === 441) {
        return 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let y = -10; y <= 10; y++) {
            for (let x = -10; x <= 10; x++) {
                if (!board[`${x},${y}`]) {
                    board[`${x},${y}`] = 'O';
                    let score = minimax(board, depth + 1, false);
                    delete board[`${x},${y}`];
                    bestScore = Math.max(score, bestScore);
                }
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let y = -10; y <= 10; y++) {
            for (let x = -10; x <= 10; x++) {
                if (!board[`${x},${y}`]) {
                    board[`${x},${y}`] = 'X';
                    let score = minimax(board, depth + 1, true);
                    delete board[`${x},${y}`];
                    bestScore = Math.min(score, bestScore);
                }
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const directions = [
        { dx: 1, dy: 0 }, { dx: 0, dy: 1 },
        { dx: 1, dy: 1 }, { dx: 1, dy: -1 }
    ];
    for (let key in board) {
        const [x, y] = key.split(',').map(Number);
        const player = board[key];
        for (let { dx, dy } of directions) {
            let count = 1;
            for (let i = 1; i < 5; i++) {
                if (board[`${x + i * dx},${y + i * dy}`] === player) {
                    count++;
                } else {
                    break;
                }
            }
            if (count === 5) {
                alert(`Player ${player} wins!`);
                return player;
            }
        }
    }
    return null;
}

resetButton.addEventListener('click', () => {
    board = {};
    currentTurn = 'X';
    createBoard();
    alert('The game has been reset.');
});

createBoard();
