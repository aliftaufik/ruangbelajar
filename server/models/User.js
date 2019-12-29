const { Schema, model, models } = require('mongoose')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'Username required'],
      validate: [
        {
          validator(val) {
            return models.User.findOne({ username: val }).then(user => {
              if (user) return false
              return true
            })
          },
          msg: 'Username already taken',
        },
        {
          validator(val) {
            return /^[a-zA-Z_.-]&/.test(val)
          },
          msg: 'Invalid username',
        },
      ],
    },
    email: {
      type: String,
      required: [true, 'Email required'],
      validate: [
        {
          validator(val) {
            return models.User.findOne({ email: val }).then(user => {
              if (user) return false
              return true
            })
          },
          msg: 'Email already registered',
        },
        {
          validator(val) {
            return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              val
            )
          },
          msg: 'Invalid email',
        },
      ],
    },
    password: {
      type: String,
      required: [true, 'Password required'],
      validate: {
        validator(val) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            val
          )
        },
        msg: 'Password too weak',
      },
    },
    fullName: {
      type: String,
      validate: {
        validator(val) {
          return /^[a-zA-Z ']$/.test(val)
        },
        msg: 'Invalid full name format',
      },
    },
  },
  { versionKey: false }
)

module.exports = model('User', userSchema)
