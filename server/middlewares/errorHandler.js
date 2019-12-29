module.exports = (err, req, res, next) => {
  let status
  const messages = []

  if (false) {
  } else {
    status = err.status
    messages.push(err.message)
  }

  res.status(status).json({ messages })
}
