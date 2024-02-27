import sql from 'mssql';
import bcrypt from 'bcrypt';
import config from '../Db/Config.js';

export const getUsers = async (req, res) => {
    try {
        const pool = await sql.connect(config.sql);
        const result = await pool.request().query("SELECT * FROM users");
        if (!result.recordset[0])
            
            return res.status(404).json({ message: 'users not found' });
            console.log(error)

        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};

export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config.sql);
        const result = await pool.request()
            .input("userid", sql.Int, id)
            .query("SELECT * FROM users WHERE userid = @userid");
        if (!result.recordset[0])
            return res.status(404).json({ message: 'user not found' });
        res.status(200).json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: "an error occurred while retrieving users" });
    } finally {
        sql.close();
    }
};

export const createUser = async (req, res) => {
    try {
        const { description } = req.body;
        const pool = await sql.connect(config.sql);
        await pool.request()
            .input("description", sql.VarChar, description)
            .query("INSERT INTO users(description) VALUES (@description)");
        res.status(201).json({ message: 'user created successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};

export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, email, password } = req.body;
        if (!password) {
            return res.status(400).json({ error: "Password is required" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const pool = await sql.connect(config.sql);
        await pool.request()
            .input('userid', sql.Int, id)
            .input('username', sql.VarChar, username)
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, hashedPassword)
            .query("UPDATE users SET username = @username, email = @email, password = @password WHERE userid = @userid");
        res.status(200).json({ message: 'user updated successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const pool = await sql.connect(config.sql);
        await pool.request().query`DELETE FROM users WHERE userid = ${id}`;
        res.status(200).json({ message: 'user deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    } finally {
        sql.close();
    }
};
