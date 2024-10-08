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

const google = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(user) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
            const {password: pass, ...restUserInfo} = user._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(restUserInfo)
        } else {
            const generatePassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcrypt.hashSync(generatePassword, 10);

            const newUser = new User({username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo})

            await newUser.save();

            const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
            const {password: pass, ...restUserInfo} = newUser._doc;
            res.cookie('access_token', token, {httpOnly: true}).status(200).json(restUserInfo);
        }
    } catch (error) {
        next(error);
    }
}

const signout = async (req, res, next) => {
    try {
        res.clearCookie('access_token');
        res.status(200).json('User has been signed out')
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signin,
    signup,
    google,
    signout
};