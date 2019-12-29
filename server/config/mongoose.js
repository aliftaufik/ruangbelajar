const connect = require('mongoose').connect
const URI = `${process.env.MONGODB_URI || 'mongodb://localhost/ruangbelajar'}${
  process.env.NODE_ENV ? '-' + process.env.NODE_ENV : ''
}`

connect(URI, {
  useFindAndModify: false,
  useUnifiedTopology: true,
  useNewUrlParser: true,
})
  .then(() => console.log('mongodb connected to', URI))
  .catch(err => console.log('mongodb connection failed.\n' + err))
