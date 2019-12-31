module.exports = (err, req, res, next) => {
  let status
  const messages = []
  const name = err.name
  // console.log(name)
  // console.log(err)

  if (name === 'ValidationError') {
    status = 422
    for (const path in err.errors) {
      messages.push(err.errors[path].message)
    }
  } else if (name == 'JsonWebTokenError') {
    status = 401
    messages.push('Valid token required')
  } else {
    status = err.status
    messages.push(err.message)
  }

  // console.log(messages)

  res.status(status).json({ messages })
}
