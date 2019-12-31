const user = require('express').Router()
const { UserController } = require('../controllers')

user.post('/signup', UserController.userSignUp)
user.post('/signin', UserController.userSignIn)

module.exports = user
