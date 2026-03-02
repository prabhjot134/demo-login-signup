const { connect, sql } = require('../db.js');
const { get } = require('../routes/authRoutes.js');

// Find a user by email
const findUserByEmail = async (email) => {
    const pool = await connect();
    const result = await pool.request()
        .input("Email", sql.NVarChar, email)
        .query("SELECT * FROM dbo.Users WHERE Email = @Email");
    return result.recordset[0]; // returns user or undefined
};

// Create a new user
const createUser = async (fullName, email, passwordHash) => {
    const pool = await connect();
    await pool.request()
        .input("FullName", sql.NVarChar, fullName)
        .input("Email", sql.NVarChar, email)
        .input("PasswordHash", sql.NVarChar, passwordHash)
        .query("INSERT INTO dbo.Users (FullName, Email, PasswordHash) VALUES (@FullName, @Email, @PasswordHash)");

    // Return the newly created user
    const result = await pool.request()
        .input("Email", sql.NVarChar, email)
        .query("SELECT FullName, Email FROM dbo.Users WHERE Email = @Email");
    return result.recordset[0];
};

// const getUsersPaginated = async (offset, limit, search) => {
//     const pool = await connect();
//     const searchFilter = `%${search}%`;
//     const result = await pool.request()
//         .input("Offset", sql.Int, offset)
//         .input("Limit", sql.Int, limit)
//         .query(`
//             SELECT FullName, Email 
//             FROM dbo.Users 
//             ORDER BY FullName 
//             OFFSET @Offset ROWS 
//             FETCH NEXT @Limit ROWS ONLY;
            
//             SELECT COUNT(*) as Total 
//             FROM dbo.Users
//             WHERE FullName LIKE @Search OR Email LIKE @Search;
//         `);
    
//     return {
//         users: result.recordsets[0],
//         total: result.recordsets[1][0].Total
//     };
// };

const getUsersPaginated = async (offset, limit, search = '') => {
    const pool = await connect();
    const searchFilter = `%${search}%`;


    const usersResult = await pool.request()
        .input("Offset", sql.Int, offset)
        .input("Limit", sql.Int, limit)
        .input("Search", sql.NVarChar, searchFilter)
        .query(`
            SELECT FullName, Email, CreatedAt 
            FROM dbo.Users 
            WHERE FullName LIKE @Search OR Email LIKE @Search
            ORDER BY FullName 
            OFFSET @Offset ROWS 
            FETCH NEXT @Limit ROWS ONLY; 
        `);


    const countResult = await pool.request()
        .input("Search", sql.NVarChar, searchFilter)
        .query(`
            SELECT COUNT(*) as Total 
            FROM dbo.Users
            WHERE FullName LIKE @Search OR Email LIKE @Search;
        `);

    return {
        users: usersResult.recordset,
        total: countResult.recordset[0].Total
    };
};

module.exports = { findUserByEmail, createUser, getUsersPaginated };