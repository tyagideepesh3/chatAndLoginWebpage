const { Sequelize, DataTypes } = require('sequelize');
//making the connection -->
const db = new Sequelize('logindb' , 'root','deepu' , {
    host: 'localhost',
    dialect: 'mysql'
})

const Users = db.define('user' , {
    
    email: {
        type: DataTypes.STRING(40),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(270),
        allowNull: false
    }
})
const Posts = db.define('posts' , {
    title: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false
    }
})
Users.hasMany(Posts)
Posts.belongsTo(Users)

module.exports = {
    Users , db , Posts
}