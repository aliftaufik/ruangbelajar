const { User } = require('../models')
const { sign } = require('jsonwebtoken')
const { compare } = require('bcryptjs')
const createError = require('http-errors')

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

  static userSignIn(req, res, next) {
    const { email, username, emailUsername, password } = req.body
    let user = null
    User.findOne({
      $or: [
        { email },
        { username },
        { email: emailUsername },
        { username: emailUsername },
      ],
    })
      .then(_user => {
        user = _user
        if (user) return compare(password, user.password)
        else throw createError(422, 'Wrong username/email/password')
      })
      .then(result => {
        if (result) {
          const token = sign({ _id: user._id }, SECRET)
          res.status(200).json({
            message: 'Sign in success',
            data: { token },
          })
        }
      })
      .catch(next)
  }
}

module.exports = UserController
