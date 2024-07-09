const User = require("../models/User");
const bcrypt = require('bcryptjs');
const errorHandler = require('../utils/error');
const jwt = require('jsonwebtoken')

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

const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const vaildUser = await User.findOne({email});
        if (!vaildUser) {
            return next(errorHandler(404, 'User not found'));
        }
        const validPassword = bcrypt.compareSync(password, vaildUser.password);
        if(!validPassword) {
            return next(errorHandler(401, 'Wrong credentials!'));
        }
        const token = jwt.sign({id: vaildUser._id}, process.env.JWT_SECRET);
        const {password: pass, ...restUserInfo} = vaildUser._doc;
        res.cookie('access_token', token, {httpOnly: true}).status(200).json(restUserInfo);
    } catch (error) {
        next(error)
    }
}

module.exports = {
    signin,
    signup
};