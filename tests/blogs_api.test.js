const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')



describe('when some blogs are initially saved', async () => {
    let tokenBearer = ''

    beforeAll(async () => {
        await Blog.remove({})
        await User.remove({})
        console.log('cleared')

        const blogObjects = helper.initialBlogs.map(n => new Blog(n))
        await Promise.all(blogObjects.map(n => n.save()))
        console.log('saved')

        const testUser = {
            username: 'Timmy69',
            name: 'Timothy Tester',
            password: 'test123',
            adult: true
        }

        //create user
        await api
            .post('/api/users')
            .send(testUser)

        //login user
        const response2 = await api
            .post('/api/login')
            .send({
                username: 'Timmy69',
                password: 'test123'
            })
        
        tokenBearer =  'bearer ' + response2.body.token

    })

    test('blogs are returned as json', async () => {
        
        console.log('\n*\n*\n*\n*\n*', 'token is:', tokenBearer, '\n*\n*\n*\n*\n*')

        console.log('starting blog get test')
        const response = await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
        
        console.log('get test body content:\n', response.body)
        
        expect(response.body.length).toBe(helper.initialBlogs.length)
        console.log('blog get test finished')
    })

    test('POST /api/blogs succeessful with valid data', async () => {
        console.log('starting blog POST test')
        const initBlogs = await helper.blogsInDb()
        const blogsAtStartLength = initBlogs.length
        const newBlog = {
            title: 'Canonical string reduction',
            author: 'Edsger W. Dijkstra',
            url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
            likes: 12
        }

        await api
            .post('/api/blogs')
            .set('authorization', tokenBearer)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const responseGet = await api.get('/api/blogs')
        //const notesAtStartLength = initialBlogs.length
        const titles = responseGet.body.map(r => r.title)

        expect(responseGet.body.length).toBe(blogsAtStartLength + 1)
        expect(titles).toContain('Canonical string reduction')
        console.log('finished blog POST test')
    })

    test('POST /api/blogs with missing likes will result in blog with zero likes', async () => {
        const newBlog = {
            title: 'Zero likes blog title',
            author: 'Zer O. Likeson',
            url: 'http://www.nolikes.com/blogpostZero'
        }

        const response = await api
            .post('/api/blogs')
            .set('authorization', tokenBearer)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(response.body.likes).toBe(0)

        console.log('likes is:', response.body.likes, '\n\n\n\n\n')
    })

    test('POST /api/blogs with missing title will return status code 400 (bad request)', async () => {
        const newBlog = {
            author: 'Forgo T. Title',
            url: 'http://www.notitle.com/blogpostTitleless'
        }

        await api
            .post('/api/blogs')
            .set('authorization', tokenBearer)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('POST /api/blogs with missing url will return status code 400 (bad request)', async () => {
        const newBlog = {
            title: 'Blog post without url is useless',
            author: 'Urlis Missing'
        }

        await api
            .post('/api/blogs')
            .set('authorization', tokenBearer)
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
    })

    test('POST /api/users with password shorter than two characters will return status code 400 (bad request)', async () => {
        const newUser = {
            username: 'Test User273461234572',
            name: 'John W. Doe',
            password: '2b',
            adult: true
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)


        expect(result.body).toEqual({ error: 'Password needs to be atleast 3 characters long.' })

    })

    test('POST /api/users two users with the same username will return status code 400 (bad request) on second user post', async () => {
        const newUser1 = {
            username: 'Mike',
            name: 'Mike Johnson',
            password: 'qarftuy45w3tag',
            adult: true
        }

        const newUser2 = {
            username: 'Mike',
            name: 'Mike Adams',
            password: 'lkjsfgdgtae654',
            adult: true
        }

        await api
            .post('/api/users')
            .send(newUser1)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        
        const result = await api
            .post('/api/users')
            .send(newUser2)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        
        expect(result.body).toEqual({ error: 'Username already exists. Please, select different username.' })
    })

    afterAll(() => {
        server.close()
    })
})
