const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((likeSum, blog) => {
        return likeSum + blog.likes
    }, 0)
}
  
module.exports = {
    dummy,
    totalLikes
}