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
  
module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}