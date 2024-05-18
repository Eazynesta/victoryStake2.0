const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    player1: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    player2: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    board: { type: Array, default: Array(8).fill(Array(8).fill(null)) },
    turn: { type: String, default: 'player1' },
    winner: { type: String, default: null },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', GameSchema);
