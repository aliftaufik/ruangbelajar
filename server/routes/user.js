const user = require('express').Router()
const { UserController } = require('../controllers')
const { authenticate } = require('../middlewares/auth')

user.post('/signup', UserController.userSignUp)
user.post('/signin', UserController.userSignIn)

user.use(authenticate)
user.get('/checksession', UserController.checkUserSession)

module.exports = user
