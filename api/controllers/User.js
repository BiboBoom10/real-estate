const bcryptjs = require('bcryptjs');

const errorHandler = require("../utils/error");

const User = require('../models/User');

const test = (req, res) => {
    res.json({
        message: 'Hello World!!'
    })
}

const updateUser = async (req, res, next) => {
    if(req.user.id !== req.params.id) {
        return next(errorHandler(401, 'You can only update your own acccount'));
    }

    try {
        if (req.body.password) {
            req.body.password = bcryptjs.hashSync(req.body.password, 10);
        }

        const updatedUser = await User.findByIdAndUpdate();

    } catch (error) {
        next(error);
    }
}

module.exports = {
    test,
    updateUser
};