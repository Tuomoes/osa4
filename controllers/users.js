const User = require('../models/user')
const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
    try {
        const users = await User
            .find({})
            .populate('blogs', {likes: 1, author: 1, title: 1, url: 1})
        response.json(users.map(user => User.format(user)))
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
        response.json(User.format(savedUser))

    } catch (exception) {
        console.log(exception)
        response.status(500).json({error: 'something went wrong... :('})
    }
})

usersRouter.delete('/:id', async (request, response) => {
    try {
        await User.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})

module.exports = usersRouter
