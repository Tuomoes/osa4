const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7
    },
    {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5
    }
]

describe('when some blogs are initially saved', async () => {

    beforeAll(async () => {
        await Blog.remove({})
        console.log('cleared')

        const blogObjects = initialBlogs.map(n => new Blog(n))
        await Promise.all(blogObjects.map(n => n.save()))
        console.log('saved')
        /**
        let blogObject = new Blog(initialBlogs[0])
        await blogObject.save
    
        blogObject = new Blog(initialBlogs[1])
        await blogObject.save
        console.log('saved')
         */
    })
    
    test('blogs are returned as json', async () => {
        
        console.log('starting blog get test')
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        console.log('get test body content:\n', response.body)
        
        expect(response.body.length).toBe(initialBlogs.length)
        console.log('blog get test finished')
    })

    test('POST /api/blogs succeessful with valid data', async () => {
        console.log('starting blog POST test')
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const responseGet = await api.get('/api/blogs')
        const notesAtStartLength = initialBlogs.length
        const titles = responseGet.body.map(r => r.title)

        expect(responseGet.body.length).toBe(notesAtStartLength + 1)
        expect(titles).toContain('Canonical string reduction')
        console.log('finished blog POST test')
    })

    afterAll(() => {
        server.close()
    })
})
