const { Schema, model } = require('mongoose')

const articleSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Article title required'],
    },
    content: String,
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { versionKey: false, timestamps: true }
)

module.exports = model('Article', articleSchema)
