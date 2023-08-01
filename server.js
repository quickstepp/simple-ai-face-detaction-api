import express from "express";
import bodyParser from "body-parser";
import cors from 'cors';
import bcrypt from "bcrypt-nodejs";
import knex from 'knex';
import register from "./controllers/register.js";
import signin from "./controllers/signin.js";
import {handleImage, handleApiCall} from "./controllers/image.js";
import getProfile from "./controllers/profile.js";

const db = knex({
    client: 'pg',
    connection: {
        host : '127.0.0.1',
        port : 5432,
        user : 'postgres',
        password : 'test',
        database : 'smart-brain'
    }
});

const PORT = process.env.PORT;
const app = express();
app.use(bodyParser.json())
app.use(cors());

app.get('/', (req, res) => {res.send(`It's working`)});
app.post('/signin', signin(db, bcrypt));
app.post('/register', register(db, bcrypt));
app.get('/profile/:id', getProfile(db));
app.put('/image', handleImage(db))
app.post('/imageurl', handleApiCall(db))

app.listen(PORT || 3000, () => {console.log(`App is running on port ${PORT}.`)});