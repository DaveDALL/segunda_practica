const express = require('express')
const { Router } = express
const router = new Router()

router.get('/:cid', (req, res) => {
    res.render('cart', {})
})

module.exports = router