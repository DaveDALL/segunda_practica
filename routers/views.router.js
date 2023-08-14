const express = require('express')
const {Router} = express
const viewsRouter = new Router()

viewsRouter.get('/userRegistration', (req, res) => {
    res.render('register', {})
})

viewsRouter.get('/', (req, res) => {
    res.render('login', {})
})

viewsRouter.get('/logout', (req, res) => {
    req.session.destroy (err => {
        if(err) res.send('Problemas con el logout!!')
        res.clearCookie('jwtCookie').redirect('/')
    })
})

module.exports = viewsRouter