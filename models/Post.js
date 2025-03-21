// Creating the DB schema

const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
    title: {
        type:String,
        require:true,
        min:2,
        max:100
    },
    description: {
        type:String,
        require:true,
        min:2,
        max:500
    },
    likes: {
        type:Number, // unsure if this is right
        default: 0
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Make sure 'User' matches the name of  User model
        // required: true, is automatically required 
    }
})

module.exports = mongoose.model('posts', PostSchema)