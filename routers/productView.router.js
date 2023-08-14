const express = require('express')
const { JsonWebTokenError } = require('jsonwebtoken')
const passport = require('passport')
const { Router } = express
const router = new Router()

router.get('/', passport.authenticate('jwtAuth', {session:false}), (req, res) => {
    let {userName, lastName, userRoll} = req.session
    res.render('products', {name: userName, lastName: lastName, roll: userRoll})
})

module.exports = router