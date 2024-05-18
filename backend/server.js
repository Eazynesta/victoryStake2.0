const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
const db = process.env.MONGO_URI;
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

// Socket.IO connection
io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Client joined game ${gameId}`);
    });

    socket.on('move', (data) => {
        const { gameId, move } = data;
        io.to(gameId).emit('move', move);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

app.get('/', (req, res) => res.send('API Running'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
