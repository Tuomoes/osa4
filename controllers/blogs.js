const blogsRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')



blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .populate('user', {username: 1, name: 1})
        .then(blogs => {
            response.json(blogs.map(blog => Blog.format(blog)))
        })
})

const getTokenFrom = (request) => {
    const authorization = request.get('authorization')
    console.log('authorization variable is:', authorization)
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

blogsRouter.post('/', async (request, response) => {
    
    console.log('request body is:', request.body)
    
    try {
        const token = getTokenFrom(request)
        console.log('token found')
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('token decoded')

        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        if (request.body.title === undefined || request.body.url === undefined)
        {
            return response.status(400).json({error: 'title or url is missing'})
        }
        



        const user = await User.findById(decodedToken.id)
        const blog = new Blog({
            likes: request.body.likes === undefined ? 0 : request.body.likes,
            author: request.body.author,
            title: request.body.title,
            url: request.body.url
        })


        user.blogs = user.blogs.concat(blog._id)
        await user.save()
    
        blog
            .save()
            .then(result => {
                response.status(201).json(result)
            })

    } catch(exception) {
        if (exception.name === 'JsonWebTokenError') {
            response.status(401).json({error: exception.message})
        } else {
            console.log(exception)
            response.status(500).json({ error: 'something went wrong :(' })
        }
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    try {
        await Blog.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        console.log(exception)
        response.status(400).send({ error: 'malformatted id' })
    }
})
blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        likes: body.likes
    }
    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, {new: true})
        response.json(updatedBlog)
    } catch (error) {
        console.log(error)
        response.status(400).send({error: 'malformatted id'})
    }
})

module.exports = blogsRouter