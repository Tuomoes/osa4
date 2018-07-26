const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const config = require('./utils/config')


app.use(cors())
app.use(bodyParser.json())

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)


//const mongoUrl = process.env.MONGODB_URI
console.log('mongoUrl is', config.mongoUrl, 'port is', config.port)
mongoose
    .connect(config.mongoUrl)
    .then( () => {
        console.log('connected to database', config.mongoUrl)
    })
    .catch( err => {
        console.log('error happened. Oh no :(')
        console.log(err)
    })

//const PORT = 3003
//const PORT = config.port
//app.listen(PORT, () => {
//    console.log(`Server running on port ${PORT}`)
//})

const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

module.exports = {
    app, server
}