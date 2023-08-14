const mongoose = require('mongoose')

const userCartSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Cart'
    }
})

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    userMail: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        trim: true,
    },
    userCart: {
        type:[userCartSchema]
    },
    userRoll : {
        type: String,
        required: true,
    }
})

userSchema.pre('findOne', function () {
    this.populate('carts.cartId')
})

const User = mongoose.model('User', userSchema)

module.exports = User