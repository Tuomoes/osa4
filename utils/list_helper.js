const dummy = (blogs) => {
    return blogs
}

const totalLikes = (blogs) => {
    return blogs.reduce((likeSum, blog) => {
        return likeSum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    // return blogs.sort((a, b) => b.likes - a.likes)[0]
    return blogs[blogs.reduce((indexOfFavorite, blog, index, blogs) => {
        if (blog.likes > blogs[indexOfFavorite].likes) return index
        else return indexOfFavorite
    }, 0)]
}

const mostBlogsAuthor = (blogs) => {
    const blogsOfAuthors = (blogs
        .reduce((authorBlogs, blog) => {
            authorBlogs[blog.author] = ((typeof authorBlogs[blog.author] === 'undefined') ? 0 : authorBlogs[blog.author]) + 1
            return authorBlogs
        }, []))


    if (blogsOfAuthors === undefined || Object.keys(blogsOfAuthors).length == 0) {
        return({ 
            author: undefined,
            blogs: undefined
        })
    }

    const mostBlogsAuthor = Object.keys(blogsOfAuthors).reduce((a, b) => blogsOfAuthors[a] > blogsOfAuthors[b] ? a : b)
    const mostBlogs = blogsOfAuthors[mostBlogsAuthor]
    return({ 
        author: mostBlogsAuthor,
        blogs: mostBlogs
    })
}

const mostLikedAuthor = (blogs) => {
    const likesOfAuthors = (blogs
        .reduce((authorLikes, blog) => {
            authorLikes[blog.author] = ((typeof authorLikes[blog.author] === 'undefined') ? 0 : authorLikes[blog.author]) + blog.likes
            return authorLikes   
        }, []))
    

    if (likesOfAuthors === undefined || Object.keys(likesOfAuthors).length == 0) {
        return({ 
            author: undefined,
            likes: undefined
        })
    }

    const mostLikedAuthor = Object.keys(likesOfAuthors).reduce((a, b) => likesOfAuthors[a] > likesOfAuthors[b] ? a : b)
    const mostLikes = likesOfAuthors[mostLikedAuthor]
    return({ 
        author: mostLikedAuthor,
        likes: mostLikes
    })  
}

//const mostXAuthor = ('blogs', ) {}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogsAuthor,
    mostLikedAuthor
}