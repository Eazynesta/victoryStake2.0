const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();

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
app.use('/api/auth', authRoutes);

app.get('/', (req, res) => res.send('API Running'));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));