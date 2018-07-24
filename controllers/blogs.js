const blogsRouter = require('express').Router()
const Blog = require('../models/blog')


blogsRouter.get('/', (request, response) => {
    Blog
        .find({})
        .then(blogs => {
            response.json(blogs)
        })
})

blogsRouter.post('/', (request, response) => {
    const blog = new Blog(request.body)
    console.log('request body is:', request.body)
    
    if (request.body.title === undefined || request.body.url === undefined)
    {
        return response.status(400).json({error: 'title or url is missing'})
    }

    if (request.body.likes === undefined) {
        blog.likes = 0
    }

    
    blog
        .save()
        .then(result => {
            response.status(201).json(result)
        })
})

module.exports = blogsRouter