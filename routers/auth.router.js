const express = require('express')
const jwt = require('jsonwebtoken')
const passport = require('passport')
const {Router} = express
const User = require('../dao/models/modelUser')
const {passHashing, validatePass} = require('../utils/bcrypt')
const authRouter = new Router()

adminUser = [{
    userName: 'administrator',
    userMail: 'adminCoder@coder.com',
    userPassword: 'adminCod3r123',
    userRoll: 'admin'
}]

authRouter.post('/authRegistration', async (req, res) => {
    let {userName, lastName, userMail, userPassword} = req.body
    try {
        if(userName && lastName && userMail && userPassword) {
            let foundUser = await User.findOne({userMail: userMail})
            if(!foundUser) {
                let hashedPassword = passHashing(userPassword)
                await User.create({
                    userName,
                    lastName,
                    userMail,
                    userPassword: hashedPassword,
                    cartId: [],
                    userRoll: 'usuario'
                })
                res.redirect('/')
            }else res.status(400).send('El usuario ya existe!!')
        }
    }catch(err) {
        console.log('No se pudo crear el usuario con mongoose ' + err)
    }
})

authRouter.post('/authLogin', async (req, res) => {
    let {userMail, userPassword} = req.body
    let foundUser = {}
    let isValidPass = false
    try {
        if(userMail === adminUser.userMail && userPassword === adminUser.userPassword) {
            foundUser = adminUser
            isValidPass = true
        }else {
            foundUser = await User.find({userMail: userMail})
            isValidPass = validatePass(userPassword, foundUser[0].userPassword)
        }
        if(foundUser.length > 0) {
            if(isValidPass) {
                req.session.userMail = foundUser[0].userMail
                req.session.userName = foundUser[0].userName
                req.session.lastName = foundUser[0].lastName || ' '
                req.session.userRoll = foundUser[0].userRoll
                let token = jwt.sign({email: userMail, password: userPassword},
                    'l4gr4ns3ns4c10nd3l4lb3r1c0qu3',
                    {expiresIn:'24h'})
                    res.cookie('jwtCookie', token).redirect('/products')
            } else res.redirect('/')  
        }else res.redirect('/userRegistration')
        
    }catch(err) {
        console.log('No se pudo confirmar el usuario con mongoose ' + err)
    }
})

module.exports = authRouter
