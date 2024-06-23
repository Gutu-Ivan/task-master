const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authMiddleware = require('./middlewares/authMiddleware');
const authRoutes = require('./routes/auth');
const todoRoutes = require('./routes/todos');
const cookieParser = require('cookie-parser');

dotenv.config();

const app = express();

async function startServer() {
    await connectDB();

    // Init Middleware
    app.use(express.json({ extended: false }));
    app.use(cookieParser());

    app.use('/api/auth', authRoutes);
    app.use('/api/todos', todoRoutes);

    app.get('/api/user/profile', authMiddleware, (req, res) => {
        res.json(req.user);
    });

    const PORT = process.env.PORT || 5001; // Измененный порт

    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}

startServer().catch(err => console.error(err));
