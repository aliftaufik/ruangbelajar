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
    password: 'Us3r1234',
    fullName: 'User The Real',
  }

  describe('User Sign Up', function() {
    context('Success', function() {
      it('Receive correct data and respond with 201, message "Sign up success", and data: new user data and token', function() {
        return server
          .post('/user/signup')
          .send(user)
          .then(res => {
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('message', 'Sign up success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('user')

            const newUser = res.body.data.user
            expect(newUser).to.have.property('username', 'user')
            expect(newUser).to.have.property('email', 'user@mail.com')
            expect(newUser).to.have.property('password', 'Us3r1234')
            expect(newUser).to.have.property('fullName', 'User The Real')

            expect(res.body.data)
              .to.have.property('token')
              .to.be.a('string')
          })
      })

      it('Receive data without fullName and respond with 201, message "Sign up success", and data: new user data without fullName and token', function() {
        return server
          .post('/user/signup')
          .send({ ...user, fullName: undefined })
          .then(res => {
            expect(res).to.have.status(201)
            expect(res.body).to.have.property('message', 'Sign up success')
            expect(res.body).to.have.property('data')
            expect(res.body.data).to.have.property('user')

            const newUser = res.body.data.user
            expect(newUser).to.have.property('username', 'user')
            expect(newUser).to.have.property('email', 'user@mail.com')
            expect(newUser).to.have.property('password', 'Us3r1234')
            expect(newUser).to.not.have.property('fullName')

            expect(res.body.data)
              .to.have.property('token')
              .to.be.a('string')
          })
      })
    })

    context('Fail', function() {
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
              'invalid email',
              'invalid password',
              'invalid fullName',
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
})
