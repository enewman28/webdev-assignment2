const express = require('express')
const app = express()
const mongoose = require('mongoose') // whenever we npm install, we must also put it here

const bodyParser = require('body-parser')
require('dotenv/config')

app.use(bodyParser.json())

const postsRoute = require('./routes/posts') // registering our resources
app.use('/api/posts', postsRoute)

const authRoute = require('./routes/auth')
app.use('/api/user', authRoute)

app.use('/', (req, res) => {
    res.send('Home')
})

// mongoose URL for the database we connect to
mongoose.connect(process.env.DB_CONNECTOR).then(()=>{
    console.log("Connecting to MongoDB.......")
})

app.listen(3000)