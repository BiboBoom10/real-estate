const User = require("../models/User");
const bcrypt = require('bcryptjs');

const signup = async (req, res, next) => {
    console.log(req.body);
    const {username, email, password} = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const newUser = new User({username, email, password: hashedPassword});
    try {
        await newUser.save();
        res.status(201).json('User saved successfully');
    } catch (error) {
        next(error);
    }
}

module.exports = signup;