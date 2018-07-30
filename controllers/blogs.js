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



blogsRouter.post('/', async (request, response) => {
    
    console.log('request body is:', request.body)
    
    try {
        //const token = getTokenFrom(request)
        const token = request.token
        console.log('token found. token is:', token)
        const decodedToken = jwt.verify(token, process.env.SECRET)
        console.log('token decoded is:', decodedToken)

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
            user: user.id,
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
        const token = request.token
        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }
        const blog = await Blog.findById(request.params.id)
        const blogUserIdInDb = blog.user.toString()
        const blogDeleteRequesterId = decodedToken.id.toString()
        console.log('Blog user id in database is:', blogUserIdInDb)
        console.log('Requester user id is:', blogDeleteRequesterId)
        if (blogUserIdInDb === blogDeleteRequesterId)
        {
            await Blog.findByIdAndRemove(request.params.id)
            response.status(204).end()
        }
        else 
        {
            return response.status(401).json({ error: 'unauthorized user' })
        }
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