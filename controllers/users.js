const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')

const formatUser = (user) => {
    return {
        _id: user.id,
        username: user.username,
        name: user.name,
        adult: user.adult
    }
}

usersRouter.get('/', async (request, response) => {
    try {
        const users = await User.find({})
        response.json(users.map(user => formatUser(user)))
    } catch (exception) {
        response.status(500).json( {error: 'something went wrong... :('} )
    }
    
})

usersRouter.post('/', async (request, response) => {
    try {
        const body = request.body
        const username = body.username

        if (body.password.length < 3) {
            return response.status(400).json({error: 'Password needs to be atleast 3 characters long.'})
        }
        const userWithThisUsername = await User.findOne({ username:username })
        console.log('found user:', userWithThisUsername)
        if (userWithThisUsername !== null) {
            return response.status(400).json({error: 'Username already exists. Please, select different username.' })
        }

        const saltRounds = 10        
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash: passwordHash,
            adult: body.adult
        })

        const savedUser = await user.save()
        response.json(formatUser(savedUser))

    } catch (exception) {
        console.log(exception)
        response.status(500).json({error: 'something went wrong... :('})
    }
})

module.exports = usersRouter
