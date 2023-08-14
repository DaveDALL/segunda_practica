const express = require('express')
const { Router } = express
const router = new Router()
const Cart = require('../dao/models/modelCart')

//Endpoint para obtener un cart por su ID
router.get('/:cid', async (req, res) => {
    let {cid} = req.params
    try {
        let cart = await Cart.findOne({_id: cid})
        if(cart){
            res.status(200).send({status: 'success', payload: cart})
        }else return res.status(204).send({status: 'error', error: 'No existen el cart en la base de datos'})
    }catch(err) {
        console.log('No es posible obtener el cart con mongoose' + err)
        res.send({status: 'error', error: 'No es posible obtener el cart con mongoose'})
    }
})

//Endpoint para crear un nuevo cart con el arreglo de productos vacio
router.post('/cart', async (req, res) => {
    try{
        let cartCreatedResult = await Cart.create({
            products: []
        })
        res.status(200).send({status: 'success', payload: cartCreatedResult})
    }catch(err) {
        console.log('No es posible crear el cart con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible crear el cart con mongoose'})
    }
})

//Endopoint para agregar un producto o actualizarlo
router.put('/:cid', async (req, res) => {
    let {cid} = req.params
    let {productId, qty} = req.body
    try {
        let foundCart = await Cart.find({_id: cid})
        let products = foundCart[0].products
        let foundProduct = products.find(product => product.productId.equals(productId))
        if(foundProduct) {
            let updatedCartResult = await Cart.updateOne({_id: cid, 'products.productId': productId}, {$set: {'products.$.qty': qty + foundProduct.qty}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }else {
            let updatedCartResult = await Cart.updateOne({_id: cid}, {$push: {products: {productId: productId, qty: qty}}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }
    }catch(err) {
        console.log('No es posible actualizar el cart con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible actualizar el cart con mongoose'})
    }
})

//Endpoint para actualizar solo la cantidad de productos
router.put('/:cid/products/:pid', async (req, res) => {
    let {cid, pid} = req.params
    let {qty} = req.body
    try {
        let foundCart = await Cart.find({_id: cid})
        let products = foundCart[0].products
        let foundProduct = products.find(product => product.productId.equals(pid))
        if(foundProduct) {
            let updatedCartResult = await Cart.updateOne({_id: cid, 'products.productId': pid}, {$set: {'products.$.qty': qty + foundProduct.qty}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }else {
            let updatedCartResult = await Cart.updateOne({_id: cid}, {$push: {products: {productId: pid, qty: qty}}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }
    }catch(err) {
        console.log('No es posible actualizar el cart con mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible actualizar el cart con mongoose'})
    }
})

//endpoint para borrar un producto del cart
router.delete('/:cid/products/:pid', async (req, res) => {
    let {pid, cid} = req.params
    try {
        let foundCart = await Cart.find({_id: cid})
        let products = foundCart[0].products
        let foundProduct = products.find(product => product.productId.equals(pid))
        if(foundProduct) {
            let updatedCartResult = await Cart.updateOne({_id: cid}, {$pull: {products: {productId: pid}}})
            res.status(200).send({status: 'success', payload: updatedCartResult})
        }
    }catch(err) {
        console.log('No es posible borrar el producto medante mongoose ' + err)
        res.status(500).send({status: 'error', error: 'No es posible borrar el producto mediante mongoose'})
    }
})

//Endpoint para borrar todos los productos de un cart
router.delete('/:cid', async (req, res) => {
    let {cid} = req.params
    try {
        let updatedCartResult = await Cart.updateOne({_id: cid}, {products: []})
        res.status(200).send({status: 'success', payload: updatedCartResult})
    }catch(err) {
        console.log('No es posible borrar el cart con mongoose '+ err)
        res.status(500).send({status: 'error', error: 'No es posible borrar el cart mediante mongoose'})
    }
})

//Endpoint para borrar un cart
router.delete('/cart/:cid', async (req, res) => {
    let {cid} = req.params
    try {
        let deletedCartResult = await Cart.deleteOne({_id: cid})
        res.status(200).send({status: 'success', payload: deletedCartResult})
    }catch(err) {
        console.log('No es posible borrar el cart con mongoose '+ err)
        res.status(500).send({status: 'error', error: 'No es posible borrar el cart mediante mongoose'})
    }
})

module.exports = router