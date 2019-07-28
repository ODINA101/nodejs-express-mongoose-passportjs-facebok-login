
const Router = require('express').Router();
const Post = require('../models/post')

Router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.find({}).populate('createdBy')

        res.send(posts)
    } catch (e) {
        //console.error(e)
        res.status(400).send(e)
    }
})


Router.post('/posts', async (req, res) => {
    console.log(req.user)
    const { title } = req.body;
    try {
        const newPost = new Post({
            title,
            createdBy: req.user._id
        })
        newPost.save();
        res.status(200).send('new post added')

    } catch (e) {
        //console.error(e)
        res.status(400).send(e)
    }
})

module.exports = Router;