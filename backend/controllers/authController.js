const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, createUser } = require('../models/userModel');
const { getUsersPaginated } = require('../models/userModel');

// SIGNUP
const signup = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;

        // Check if user already exists
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: "Email already in use." });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const newUser = await createUser(fullName, email, passwordHash);

        const token = jwt.sign(
            { email: newUser.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(201).json({
            message: "Signup Successful",
            token,
            user: newUser
        });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ error: "Signup failed. Try a different email." });
    }
};

// LOGIN
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await findUserByEmail(email);
        if (!user) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        const isMatch = await bcrypt.compare(password, user.passwordhash);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid Email or Password" });
        }

        const token = jwt.sign(
            { email: user.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({
            message: "Login Successful",
            token,
            user: {
                FullName: user.fullname,
                Email: user.email
            }
        });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const search = req.query.search || '';
        const limit = 10;
        const offset = (page - 1) * limit;

        const data = await getUsersPaginated(offset, limit, search);

        res.status(200).json({
            users: data.users,
            total: data.total,
            currentPage: page,
            totalPages: Math.ceil(data.total / limit)
        });
    } catch (error) {
        console.error("Pagination Controller Error:", error); 
        res.status(500).json({ error: "Failed to fetch users" });
    }
};

module.exports = { signup, login, getAllUsers };