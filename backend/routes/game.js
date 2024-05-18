const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const router = express.Router();

const io = require('../server').io; // Import io from server.js

// Create a new game
router.post('/create', auth, async (req, res) => {
    try {
        const newGame = new Game({ player1: req.user.id });
        const game = await newGame.save();
        io.emit('gameCreated', game); // Emit game creation event
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Get all available games
router.get('/', auth, async (req, res) => {
    try {
        const games = await Game.find({ player2: null }).populate('player1', 'username');
        res.json(games);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Join a game
router.post('/join/:gameId', auth, async (req, res) => {
    try {
        let game = await Game.findById(req.params.gameId);
        if (!game) {
            console.log('Game not found');
            return res.status(404).json({ msg: 'Game not found' });
        }

        if (game.player2) {
            console.log('Game is already full');
            return res.status(400).json({ msg: 'Game is already full' });
        }

        game.player2 = req.user.id;
        await game.save();

        io.to(game._id).emit('gameUpdate', game); // Emit game update to both players

        console.log('Joined game:', game);
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Fetch a specific game by ID
router.get('/:gameId', auth, async (req, res) => {
    try {
        const game = await Game.findById(req.params.gameId).populate('player1', 'username').populate('player2', 'username');
        if (!game) {
            return res.status(404).json({ msg: 'Game not found' });
        }
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

// Move a piece
router.post('/move', auth, async (req, res) => {
    const { gameId, from, to } = req.body;
    try {
        const game = await Game.findById(gameId);
        if (!game) return res.status(404).json({ msg: 'Game not found' });

        // Add logic to validate the move and update the board state
        if (!validateMove(game, from, to)) {
            return res.status(400).json({ msg: 'Invalid move' });
        }

        updateBoard(game, from, to);

        game.turn = game.turn === 'player1' ? 'player2' : 'player1';

        await game.save();
        io.to(game._id).emit('move', { from, to }); // Emit move to both players

        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

const validateMove = (game, from, to) => {
    // Add move validation logic here
    // This function should return true if the move is valid, otherwise false
    return true; // Placeholder, replace with actual validation
};

const updateBoard = (game, from, to) => {
    // Add logic to update the board state here
    // This function should modify the game.board array to reflect the move
};

module.exports = router;
