const routes = require('express').Router()

routes.use('/user', require('./user'))

module.exports = routes
