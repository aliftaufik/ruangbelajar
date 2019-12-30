const { User } = require('../models')
const { sign } = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

class UserController {
  static userSignUp(req, res, next) {
    const { username, email, password, fullName } = req.body

    User.create({ username, email, password, fullName })
      .then(user => {
        const token = sign({ _id: user._id }, SECRET)
        res.status(201).json({
          message: 'Sign up success',
          data: {
            user: {
              ...user._doc,
              password,
            },
            token,
          },
        })
      })
      .catch(next)
  }
}

module.exports = UserController
