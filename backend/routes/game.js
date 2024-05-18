const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');
const User = require('../models/User');

const router = express.Router();

// Create a new game
router.post('/create', auth, async (req, res) => {
    try {
        const newGame = new Game({ player1: req.user.id });
        const game = await newGame.save();
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
        if (!game) return res.status(404).json({ msg: 'Game not found' });

        if (game.player2) return res.status(400).json({ msg: 'Game is already full' });

        game.player2 = req.user.id;
        await game.save();
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
        // For now, let's just log the move
        console.log(`Move from ${from} to ${to}`);

        await game.save();
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
