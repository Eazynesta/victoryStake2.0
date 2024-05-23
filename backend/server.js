require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

module.exports = { io };

app.use(bodyParser.json());
app.use(cors());

const db = process.env.MONGO_URI;
mongoose.connect(db)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

const authRoutes = require('./routes/auth');
const gameRoutes = require('./routes/game');
app.use('/api/auth', authRoutes);
app.use('/api/game', gameRoutes);

app.get('/', (req, res) => res.send('API Running'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('joinGame', (gameId) => {
        socket.join(gameId);
        console.log(`Client joined game ${gameId}`);
    });

    socket.on('sendMessage', (data) => {
        const { gameId, message } = data;
        io.to(gameId).emit('receiveMessage', message);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
