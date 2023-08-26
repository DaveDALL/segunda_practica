const express = require('express')
const jwt = require('jsonwebtoken')
const {Router} = express
const passport = require('passport')

const gitRouter = new Router

gitRouter.get('/github', passport.authenticate('gitHubAuth', {scope: ['user:email'], session: false}))

gitRouter.get('/github/callback', passport.authenticate('gitHubAuth', {scope: ['user:email'], session:false, failureRedirect: '/'}),
async (req, res) => {
    let {userMail, userName, lastName, userRoll} = await req.user
    req.session.userMail = userMail
    req.session.userName = userName
    req.session.lastName = lastName || ' '
    req.session.userRoll = userRoll
    let token = jwt.sign({email: userMail},
        'l4gr4ns3ns4c10nd3l4lb3r1c0qu3',
        {expiresIn:'24h'})
        res.cookie('jwtCookie', token).redirect('/products')
})

module.exports = gitRouter