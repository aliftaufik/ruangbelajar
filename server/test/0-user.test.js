const chai = require('chai')
const { expect } = chai
const chaiHttp = require('chai-http')
const { User } = require('../models')
const { sign } = require('jsonwebtoken')

const app = require('../app')

chai.use(chaiHttp)

const server = chai.request(app)

before('Keep Open http request', function() {
  server.keepOpen()
  console.log('Server keep open')
})

after('Close http request', function() {
  server.close()
  console.log('Server closed')
})

const registeredUser = {
  username: 'dummy',
  email: 'dummy@mail.com',
  password: 'Dum2y!23',
  fullName: 'Dummy The Guy',
}
before('Mock registered user', function(done) {
  User.create(registeredUser)
    .then(() => {
      console.log('Mock registered user')
      done()
    })
    .catch(done)
})

after('Delete all data', function(done) {
  User.deleteMany({})
    .then(() => {
      console.log('All data deleted')
      done()
    })
    .catch(done)
})

describe('User Tests', function() {
  const user = {
    username: 'user',
    email: 'user@mail.com',
    password: 'Us3r!234',
    fullName: 'User The Real',
  }

  describe('User Sign Up', function() {
    context('On Success', function() {
      beforeEach('Delete new user data', async function() {
        await User.deleteOne({ username: user.username })
      })

      it('Receive correct data and respond with 201, message "Sign up success", and data: new user data and token', function() {
        return server
          .post('/user/signup')
          .send(user)
          .then(res => {
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('message', 'Sign up success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('user')
            expect(res.body.data.user).to.include({ ...user })
            expect(res.body.data.user).to.have.property('_id')

            // const newUser = res.body.data.user
            // expect(newUser).to.have.property('username', 'user')
            // expect(newUser).to.have.property('email', 'user@mail.com')
            // expect(newUser).to.have.property('password', 'Us3r1234')
            // expect(newUser).to.have.property('fullName', 'User The Real')

            expect(res.body.data)
              .to.have.property('token')
              .to.be.a('string')
          })
      })

      it('Receive data without fullName and respond with 201, message "Sign up success", and data: new user data without fullName and token', function() {
        const noFullNameUser = { ...user }
        delete noFullNameUser.fullName

        return server
          .post('/user/signup')
          .send({ ...user, fullName: undefined })
          .then(res => {
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('message', 'Sign up success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('user')
            expect(res.body.data.user).to.include({
              ...noFullNameUser,
            })
            expect(res.body.data.user).to.have.property('_id')

            // const newUser = res.body.data.user
            // expect(newUser).to.have.property('username', 'user')
            // expect(newUser).to.have.property('email', 'user@mail.com')
            // expect(newUser).to.have.property('password', 'Us3r1234')
            // expect(newUser).to.have.property('fullName', 'User The Real')

            expect(res.body.data)
              .to.have.property('token')
              .to.be.a('string')
          })
      })
    })

    context('On Failed', function() {
      it('Receive no data and respond with 422 and messages: "username required", "email required", "password required"', function() {
        return server
          .post('/user/signup')
          .send({})
          .then(res => {
            expect(res).to.have.status(422)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              'username required',
              'email required',
              'password required',
            ])
          })
      })

      it('Receive invalid format data and respond with 422 and messages: "invalid username", "invalid email", "invalid password", "invalid fullName"', function() {
        const invalidUser = {
          username: 'with space',
          email: 'noat.com',
          password: 'with space',
          fullName: 'with umb3r',
        }
        return server
          .post('/user/signup')
          .send(invalidUser)
          .then(res => {
            expect(res).to.have.status(422)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              'Invalid username',
              'Invalid email',
              'Invalid password',
              'Invalid fullName',
            ])
          })
      })

      it('Receive data with registered username and email and respond with 422 and messages: "username already taken", "email already registered"', function() {
        return server
          .post('/user/signup')
          .send(registeredUser)
          .then(res => {
            expect(res).to.have.status(422)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              'username already taken',
              'email already registered',
            ])
          })
      })
    })
  })

  describe('User Sign In', function() {
    context('On Success', function() {
      it('Receive data using username and respond with 200, message "Sign in success", and data: token', function() {
        const signInUsernname = {
          username: registeredUser.username,
          password: registeredUser.password,
        }

        return server
          .post('/user/signin')
          .send(signInUsernname)
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('message', 'Sign in success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.keys(['token'])
          })
      })

      it('Receive data using email and respond with 200, message "Sign in success", and data: token', function() {
        const signInEmail = {
          email: registeredUser.email,
          password: registeredUser.password,
        }

        return server
          .post('/user/signin')
          .send(signInEmail)
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('message', 'Sign in success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.keys(['token'])
          })
      })

      it('Receive data using emailUsername and respond with 200, message "Sign in success", and data: token', function() {
        const signInEmailUsername = {
          emailUsername: registeredUser.email,
          password: registeredUser.password,
        }

        return server
          .post('/user/signin')
          .send(signInEmailUsername)
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('message', 'Sign in success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.keys(['token'])
          })
      })
    })

    context('On Failed', function() {
      it('Receive no data and respond with 422 and messages: "Wrong username/email/password"', function() {
        return server
          .post('/user/signin')
          .send({})
          .then(res => {
            expect(res).to.have.status(422)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              'Wrong username/email/password',
            ])
          })
      })

      it('Receive incorrect data and respond with 422 and messages: "Wrong username/email/password"', function() {
        return server
          .post('/user/signin')
          .send({
            username: 'notregistered',
            password: 'notregistered',
          })
          .then(res => {
            expect(res).to.have.status(422)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              'Wrong username/email/password',
            ])
          })
      })
    })
  })

  describe('User Check Session', function() {
    context(
      'This will include authenticate test, so further test with authentication will not be asserted'
    )
    let token = null

    before('Mock token', function(done) {
      User.findOne({ email: registeredUser.email })
        .then(user => {
          token = sign({ _id: user._id }, process.env.JWT_SECRET)
          console.log('Mock token')
          done()
        })
        .catch(done)
    })

    context('On Success', function() {
      it('Receive correct header and respond with 200 and data: _id, username, email, fullName', function() {
        const { username, email, fullName } = registeredUser
        return server
          .get('/user/checksession')
          .set({ Authorization: 'token ' + token })
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.include({ username, email, fullName })
            expect(res.body.data).to.have.property('_id')
          })
      })
    })

    context('On Failed', function() {
      it('Receive no required header and respond with 401 and messages: "Valid token required"', function() {
        return server.get('/user/checksession').then(res => {
          expect(res).to.have.status(401)
          expect(res.body).to.have.property('messages')
          expect(res.body.messages).to.have.members(['Valid token required'])
        })
      })

      it('Receive header with invalid token value and respond with 401 and messages: "Valid token required"', function() {
        return server
          .get('/user/checksession')
          .set({ Authorization: 'token X' + token.slice(1) })
          .then(res => {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members(['Valid token required'])
          })
      })

      it('Receive header with token but without "token" prefix and respond with 422 and messages: "token require \'token\' prefix', function() {
        return server
          .get('/user/checksession')
          .set({ Authorization: token })
          .then(res => {
            expect(res).to.have.status(401)
            expect(res.body).to.have.property('messages')
            expect(res.body.messages).to.have.members([
              "token require 'token' prefix",
            ])
          })
      })
    })
  })
})
