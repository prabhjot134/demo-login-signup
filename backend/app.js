require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/auth', authRoutes);

app.listen(port, () => console.log(`Server running on port ${port}`));