const user = require('express').Router()
const { UserController } = require('../controllers')

user.post('/signup', UserController.userSignUp)

module.exports = user
