const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    board: { type: Array, default: () => initializeBoard() },
    turn: { type: String, default: 'player1' },
    winner: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

const initializeBoard = () => {
    const board = Array(8).fill(null).map(() => Array(8).fill(null));
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if ((i + j) % 2 === 1) {
                if (i < 3) board[i][j] = 'player1';
                else if (i > 4) board[i][j] = 'player2';
            }
        }
    }
    return board;
};

module.exports = mongoose.model('Game', GameSchema);
