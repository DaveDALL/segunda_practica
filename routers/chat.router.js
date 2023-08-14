const express = require('express')
const { Router } = express
const Message = require('../dao/models/modelMessage')


function customerChat(io) {
    const router = new Router()
    let allMessages = []
    let createdMessage = {}
    let control = 0
    
    router.get('/', async (req, res) => {
        if(control === 0) {
            createdMessage = await Message.create({messages: allMessages})
            control = 1
        }
        io.on('connection', (socket) => {
            console.log('nuevo usuario conectado ' + socket.id)
            socket.on('chatMessage', (data) => {
                allMessages.push(data)
                io.emit('allMessages', allMessages)
            })
            socket.on('disconnect', async (reason) => {
                console.log('usuario desconectado ' + reason)
                try {
                    if(control === 1) {
                        await Message.updateOne({_id: createdMessage._id}, {messages: allMessages})
                        allMessages = []
                        control = 0
                    }
                }catch(err) {
                    console.log('Error al crear el chat en mongoose ' + err)
                }
            })
        })
        
        res.render('chat', {})
    })

    return router
}

module.exports = customerChat