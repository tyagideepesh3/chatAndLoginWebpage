const http = require('http')
const socketio = require('socket.io')

const express = require('express')
const { route } = require('./routes')
const app = express()
const server = http.createServer(app)
const io = socketio(server)
const path = require('path')
const {db} = require('./db.js')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.set('view engine' , 'ejs')
app.set('views' , path.join(__dirname , 'views'))

io.on('connection' , (socket) => {
    console.log('confirmation test : ' + socket.id)
    socket.on('msg_send' , (data) => {
        socket.join(data.by)
        if(data.to){
            io.to(data.to).emit('msg_rcved' , data)
        }else{
            socket.broadcast.emit('msg_rcved' , data)
        }
    })
})

app.get('/register' , route)
app.post('/register' , route)

app.get('/login' , route);
app.post('/login' , route);

app.get('/success', route);
app.get('/logout' , route);

app.get('/writepost', route)
app.post('/writepost' , route)

app.get('/api/mypost' , route)

app.get('/api/allposts' , route)




//files call for chat
app.get('/chat' , route)
//this is the chat static file
app.use('/allposts' , express.static(path.join(__dirname , 'public')))
db.sync().then(() => {
    server.listen('4000' , () => {
        console.log('we start the server')
    })
}).catch((err) => {console.error(err)})

//done no changes till now