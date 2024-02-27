import express from 'express';
import bodyParser from 'body-parser';
import config from './Db/Config.js';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();

// Middlewares
app.use(bodyParser.json()); // Use bodyParser.json() to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
    if (
        req.headers && // Check if request has the header
        req.headers.authorization && // Check if request has authorization header
        req.headers.authorization.split(" ")[0] === "JWT" // Check if header has JWT token
    ) {
        jwt.verify(
            req.headers.authorization.split(" ")[1],
            config.jwt_secret,
            (err, decode) => {
                if (err) req.user = undefined;
                req.user = decode;
                next();
            }
        );

    } else {
        req.user = undefined;
        next();
    }
});

app.get("/", (req, res) => {
    res.send("It's a new year 2024");
});

app.listen(config.port || 5000, () => {
    console.log('Server is running on', config.port || 5000);
});
