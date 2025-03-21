const express = require('express')
const router = express.Router()

const Post = require('../models/Post') // 
const User = require('../models/User')
const {postValidation} = require('../validations/validation')
const verifyToken = require('../verifyToken')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const { json } = require('body-parser')

// creating a post, requires auth
router.post('/', verifyToken, async(req, res) => {

    const {error} = postValidation(req.body)
    if(error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }
    const user = await User.findById(req.user._id);

    // Code to insert data
    const post = new Post({
        title:req.body.title,
        description:req.body.description,
        likes:req.body.likes || 0,
        createdBy: user // could user user.username to get exact username here, but requirements specify a user reference
    })

    try {
        const savedPost = await post.save()
        res.send(savedPost)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

// this GET just gets all the data, no verification needed
router.get('/', async(req, res) => {
    try {
    const posts = await Post.find()
    res.send(posts)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

// get post by ID, publicly available
router.get('/:postId', async(req, res) => {
    const post = await Post.findById(req.params.postId)
    if (!post) {
        return res.status(404).send({message: "Post not found"})
    }
    else {
        res.send(post)
    }
})

// update a post, only possible by post creator
router.put('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        if (!post) {
            return res.status(404).send({message: "Post not found"})
        }

        const user = await User.findById(req.user._id);

        // Check if the logged-in user is the creator
        if (post.createdBy.toString() !== user._id.toString()) {
            return res.status(403).send({ message:"You are not authorized to update this post"})
        }

        // Validating info provided to update post
        const {error} = postValidation(req.body)
        if(error) {
            return res.status(400).send({message:error['details'][0]['message']})
        }
        else {
            post.title = req.body.title
            post.description = req.body.description
            post.likes = req.body.likes
        }

        // Save updated post
        const updatedPost = await post.save()
        res.send(updatedPost)

    } catch (err) {
        res.status(500).send({message:err.message})
    }
});

// delete a post, only possible by post creator
router.delete('/:postId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId)
        if (!post) {
            return res.status(404).send({message: "Post not found"})
        }

        const user = await User.findById(req.user._id);

        // Check if the logged-in user is the creator
        if (post.createdBy.toString() !== user._id.toString()) {
            return res.status(403).send({ message:"You are not authorized to update this post"})
        }

        await Post.findByIdAndDelete(req.params.postId);
        res.send({message:'Post deleted successfully'})

    } catch (err) {
        res.status(500).send({message:err.message})
    }
});

module.exports = router