import sql from 'mssql';
import config from '../Db/Config.js';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// Login required middleware
export const loginRequired = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        return res.status(401).json({ message: "Unauthorized user!" });
    }
}

// Register user
export const registerUser = async (req, res) => {
    const { email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM users WHERE email = @email");

        const user = result.recordset[0];
        if (user) {
            return res.status(409).json({ error: "User already exists!" });
        } else {
            await pool.request()
                .input("email", sql.VarChar, email)
                .input("password", sql.VarChar, hashedPassword)
                .query("INSERT INTO users (email, password) VALUES (@email, @password)");
            res.status(200).json({ message: "User created successfully" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};

// Login user
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        let pool = await sql.connect(config.sql);
        let result = await pool.request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, password)
            .query("SELECT * FROM users WHERE email = @email AND password = @password");

        const user = result.recordset[0];
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        } else {
            // Create token
            const token = jwt.sign(
                { email: user.email, password: user.password },
                config.jwt_secret,
                { expiresIn: "1h" }
            );
            res.status(200).json({ email: user.email, password: user.password, token: token });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};
