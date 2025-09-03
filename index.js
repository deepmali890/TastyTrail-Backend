const express = require('express');
require('dotenv').config();
require('./src/db/config');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./src/routes/auth.routes')
const userRoutes = require('./src/routes/user.routes')
const shopRoutes = require('./src/routes/shop.routes')
const itemsRoutes = require('./src/routes/item.routes')



const app = express();

const corsOptions = {
    origin: ['http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));


// Middleware
app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shop', shopRoutes);
app.use('/api/items', itemsRoutes);



// Global error handler
app.use((error, req, res, next) => {
    const message = error.message || 'Server Error';
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ message });
});

app.get('/', (req, res) => {
    res.send('Welcome to the Tasty Trail API!');
});


// Always bind to PORT — for both dev & Render
const PORT = process.env.PORT || 1200;
app.listen(PORT, () => {
    console.log(`🚀 Server is live at: http://localhost:${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});