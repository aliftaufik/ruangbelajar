process.env.NODE_ENV === 'development' && require('dotenv').config()
process.env.NODE_ENV === 'test' && require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('./config/mongoose')
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(morgan('dev'))

app.use('/', require('./routes'))
app.use('*', require('./middlewares/404'))
app.use(require('./middlewares/errorHandler'))

module.exports = app
