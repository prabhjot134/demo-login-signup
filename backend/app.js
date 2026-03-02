require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connect } = require('./db.js');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

// Connect to DB
connect()
    .then(() => console.log("Connected to the database."))
    .catch((error) => {
        console.log("Database connection failed!");
        console.log(error);
    });

app.get('/', (req, res) => {
    res.send('Hello World!');
});

// All auth routes are prefixed with /api/auth
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});