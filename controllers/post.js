const {Posts , Users} = require('../db')

async function createAPost(userId ,title,body ) {
    const post = await Posts.create({
        userId,
        title,
        body
    })
    return post
}
async function FindAllPost() {
    const posts = await Posts.findAll({
        include: [Users]
    })
    return posts
}
async function findPostById(id){
    const post = await Posts.findAll({
        where: {userId : id},
        include: [Users]
    })
    return post;
}
module.exports = {
    createAPost,
    FindAllPost,
    findPostById
}