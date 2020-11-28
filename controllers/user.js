const { Users } = require('../db')

const addNewUsers =  async (email , password) => {
    const user = await Users.create({
        email,
        password
    })
    return user
}
const findOneUser = async (email) => {
    const user = await Users.findOne({where:{email}})
    return user
}
module.exports = {
    addNewUsers,
    findOneUser
}