const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');

const userRouter = require('./routes/User.js');
const authRouter = require('./routes/auth');
const listingRouter = require('./routes/listing.js')

dotenv.config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/listing', listingRouter);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to Mongo DB')
    })
    .catch((err) => {
        console.log(err);
    })

app.listen(3000, () => {
    console.log('Port 3000 is running!');
})

