const { pool } = require('../db.js');

const findUserByEmail = async (email) => {
    const result = await pool.query(
        'SELECT * FROM Users WHERE Email = $1', [email]
    );
    return result.rows[0];
};

const createUser = async (fullName, email, passwordHash) => {
    const result = await pool.query(
        'INSERT INTO Users (FullName, Email, PasswordHash) VALUES ($1, $2, $3) RETURNING FullName, Email',
        [fullName, email, passwordHash]
    );
    return result.rows[0];
};

const getUsersPaginated = async (offset, limit, search = '') => {
    const searchFilter = `%${search}%`;

    const usersResult = await pool.query(
        `SELECT FullName, Email, CreatedAt FROM Users 
         WHERE FullName ILIKE $1 OR Email ILIKE $1
         ORDER BY FullName
         LIMIT $2 OFFSET $3`,
        [searchFilter, limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) as total FROM Users 
         WHERE FullName ILIKE $1 OR Email ILIKE $1`,
        [searchFilter]
    );

    return {
        users: usersResult.rows,
        total: parseInt(countResult.rows[0].total)
    };
};

module.exports = { findUserByEmail, createUser, getUsersPaginated };