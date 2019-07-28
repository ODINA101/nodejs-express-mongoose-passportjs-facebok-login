const Router = require('express').Router();
const User = require('../models/user')

Router.get('/users', async (req, res) => {
    console.log(req.user)
    try {
        const users = await User.find({});
        res.send(users)
        next();
    } catch (e) {
        //console.error(e)
        res.status(400).send(e)
    }
})








module.exports = Router;