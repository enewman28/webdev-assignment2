const express = require('express')
const router = express.Router()

const User = require('../models/User')
const {registerValidation, loginValidation} = require('../validations/validation')

const bcryptjs = require('bcryptjs')
const jsonwebtoken = require('jsonwebtoken')
const { json } = require('body-parser')

router.post('/register', async(req, res) => {
    // Validation to check user input against requirements
    const {error} = registerValidation(req.body)
    if(error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 to check if user already exists in database
    const userExists = await User.findOne({email:req.body.email})
    if(userExists) {
        return res.status(400).send({message:'User already exists'})
    }

    // hashed representation of password
    const salt = await bcryptjs.genSalt(5)
    const hashedPassword = await bcryptjs.hash(req.body.password, salt)

    // Code to insert data
    const user = new User({
        username:req.body.username,
        email:req.body.email,
        password:hashedPassword
    })

    try {
        const savedUser = await user.save()
        res.send(savedUser)
    } catch(err) {
        res.status(400).send({message:err})
    }
})

router.post('/login', async(req, res) => {
    // Validation to check user input against requirements
    const {error} = loginValidation(req.body)
    if(error) {
        return res.status(400).send({message:error['details'][0]['message']})
    }

    // Validation 2 to check if user already exists in database
    const user = await User.findOne({email:req.body.email})
    if(!user) {
        return res.status(400).send({message:'User does not exist'})
    }

    // Validation 3 - check user password, must decrypt first
    const passwordValidation = await bcryptjs.compare(req.body.password, user.password)
    if(!passwordValidation) {
        return res.status(400).send({message:'Password incorrect'})
    }
    // res.send({message:'Login successful.'})

    // Generate an auth token for your user
    const token = jsonwebtoken.sign({_id:user._id}, process.env.TOKEN_SECRET) // use the user ID to create the token
    res.header('auth-token', token).send({'auth-token':token})
})

module.exports = router