const listHelper = require('../utils/list_helper')

const emptyListOfBlogs = []

const listWithOneBlog = [
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    }
]

const listWithManyBlogs = [
    {
        _id: '5a422a851b54a676234d17f7',
        title: 'React patterns',
        author: 'Michael Chan',
        url: 'https://reactpatterns.com/',
        likes: 7,
        __v: 0
    },
    {
        _id: '5a422aa71b54a676234d17f8',
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
        likes: 5,
        __v: 0
    },
    {
        _id: '5a422b3a1b54a676234d17f9',
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
        likes: 12,
        __v: 0
    },
    {
        _id: '5a422b891b54a676234d17fa',
        title: 'First class tests',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
        likes: 10,
        __v: 0
    },
    {
        _id: '5a422ba71b54a676234d17fb',
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
        likes: 0,
        __v: 0
    },
    {
        _id: '5a422bc61b54a676234d17fc',
        title: 'Type wars',
        author: 'Robert C. Martin',
        url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
        likes: 2,
        __v: 0
    }  
]

test('dummy is called', () => {

    const result = listHelper.dummy(emptyListOfBlogs)
    expect(result).toBe(emptyListOfBlogs)
})

describe('total likes', () => {

    test('when list is empty -> zero likes', () => {
        const result = listHelper.totalLikes(emptyListOfBlogs)
        expect(result).toBe(0)
    })

    test('when list has only one blog equals the likes of that', () => {
        const result = listHelper.totalLikes(listWithOneBlog)
        expect(result).toBe(5)
    })

    test('when list has many blogs equals the sum of likes', () => {
        const result = listHelper.totalLikes(listWithManyBlogs)
        expect(result).toBe(36)
    })
})


describe('best blog', () => {

    test('when list has many blogs, the one with most likes is returned', () => {
        const result = listHelper.favoriteBlog(listWithManyBlogs)
        expect(result).toEqual(listWithManyBlogs[2])
    })

    test('when list has no blogs, result is undefined', () => {
        const result = listHelper.favoriteBlog(emptyListOfBlogs)
        //console.log(result)
        expect(result).toEqual(undefined)
    })

    test('when list has one blog, the result is that one', () => {
        const result = listHelper.favoriteBlog(listWithOneBlog)
        //console.log(result)
        expect(result).toEqual(listWithOneBlog[0])
    })
})

describe('most blogs author', () => {
    test('when list has multiple authors, the name and blog count equals the correct values', () => {
        const result = listHelper.mostBlogsAuthor(listWithManyBlogs)
        const expectedValue = {
            author: 'Robert C. Martin',
            blogs: 3
        }
        expect(result).toEqual(expectedValue)
    })

    test('when list has one authors, the name and blog count equals that one', () => {
        const result = listHelper.mostBlogsAuthor(listWithOneBlog)
        const expectedValue = {
            author: 'Edsger W. Dijkstra',
            blogs: 1
        }
        expect(result).toEqual(expectedValue)
    })

    test('when list has no authors, the name and blog count equals undefined', () => {
        const result = listHelper.mostBlogsAuthor(emptyListOfBlogs)
        const expectedValue = {
            author: undefined,
            blogs: undefined
        }
        expect(result).toEqual(expectedValue)
    })
})

describe('most liked author', () => {
    test('when list has multiple authors, the name and like count equals the correct values', () => {
        const result = listHelper.mostLikedAuthor(listWithManyBlogs)
        const expectedValue = {
            author: 'Edsger W. Dijkstra',
            likes: 17
        }
        expect(result).toEqual(expectedValue)
    })

    test('when list has one authors, the name and like count equals that one', () => {
        const result = listHelper.mostLikedAuthor(listWithOneBlog)
        const expectedValue = {
            author: 'Edsger W. Dijkstra',
            likes: 5
        }
        expect(result).toEqual(expectedValue)
    })

    test('when list has no authors, the name and like count equals undefined', () => {
        const result = listHelper.mostLikedAuthor(emptyListOfBlogs)
        const expectedValue = {
            author: undefined,
            likes: undefined
        }
        expect(result).toEqual(expectedValue)
    })
})


