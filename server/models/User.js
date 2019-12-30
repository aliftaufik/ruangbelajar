const { Schema, model, models } = require('mongoose')
const { hash } = require('bcryptjs')

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'username required'],
      validate: [
        {
          validator(val) {
            return models.User.findOne({ username: val }).then(user => {
              if (user) return false
              return true
            })
          },
          msg: 'username already taken',
        },
        {
          validator(val) {
            return /^[a-zA-Z_.-]+$/.test(val)
          },
          msg: 'Invalid username',
        },
      ],
    },
    email: {
      type: String,
      required: [true, 'email required'],
      validate: [
        {
          validator(val) {
            return models.User.findOne({ email: val }).then(user => {
              if (user) return false
              return true
            })
          },
          msg: 'email already registered',
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
      required: [true, 'password required'],
      validate: {
        validator(val) {
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/.test(
            val
          )
        },
        msg: 'Invalid password',
      },
    },
    fullName: {
      type: String,
      validate: {
        validator(val) {
          return /^[a-zA-Z ']+$/.test(val)
        },
        msg: 'Invalid fullName',
      },
    },
  },
  { versionKey: false }
)

userSchema.pre('save', async function(next) {
  this.password = await hash(this.password, 10).catch(next)
  next()
})

module.exports = model('User', userSchema)
