const express = require('express');
const auth = require('../middleware/auth');
const Game = require('../models/Game');

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
        console.log('Joined game:', game);
        res.json(game);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
