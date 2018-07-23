const dummy = (blogs) => {
    return 1
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

const mostLikedAuthor = (blogs) => {
    const likesOfAuthors = (blogs
        .reduce((authorLikes, blog) => {
            authorLikes[blog.author] = ((typeof authorLikes[blog.author] === 'undefined') ? 0 : authorLikes[blog.author]) + blog.likes
            return authorLikes   
        }, []))

    const mostLikedAuthor = Object.keys(likesOfAuthors).reduce((a, b) => likesOfAuthors[a] > likesOfAuthors[b] ? a : b)
    const mostLikes = likesOfAuthors[mostLikedAuthor]
    return({ 
        author: mostLikedAuthor,
        likes: mostLikes
    })
    
    //.sort((a, b) => a < b)
//        .reduce((mostLiked, element) => {
//            console.log(element)
//            mostLiked = element
//            console.log(mostLiked)
//            return mostLiked
//        }, {})
    
}
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostLikedAuthor
}