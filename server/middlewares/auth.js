const { User } = require('../models')
const { verify } = require('jsonwebtoken')
const createError = require('http-errors')

module.exports = {
  async authenticate(req, res, next) {
    try {
      const token = req.headers.authorization
      if (token) {
        if (token.includes('token ')) {
          const payload = verify(token.slice(6), process.env.JWT_SECRET)
          const user = await User.findById(payload._id)
          if (user) {
            req.user = user
            next()
          } else throw createError(401, 'User has been removed')
        } else throw createError(422, "token require 'token' prefix")
      } else throw createError(401, 'Valid token required')
    } catch (err) {
      next(err)
    }
  },
}
