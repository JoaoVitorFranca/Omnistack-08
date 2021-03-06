const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const routes = require('./routes.js')

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const connectedUsers = {}

io.on('connection', socket => {
    const { user } = socket.handshake.query
    connectedUsers[user] = socket.id
    console.log('Client connectet:', user )

})

mongoose.connect('mongodb://127.0.0.1:27017', {
    useNewUrlParser: true   
})

app.use((req, res, next) => {
    req.io = io
    req.connectedUsers = connectedUsers

    return next()
})

app.use(express.json())
app.use(cors())
app.use(routes)

server.listen(3333)