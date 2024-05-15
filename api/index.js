const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

const userRouter = require('./routes/User.js');
const authRouter = require('./routes/auth');

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to Mongo DB')
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(3000, () => {
    console.log('Port 3000 is running!');
})

