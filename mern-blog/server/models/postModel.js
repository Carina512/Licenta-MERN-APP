const {Schema, model} = require('mongoose')



const postSchema = Schema({
    title: {type: String, required: true},
    category: {type: String, enum: {values:  ["Healthy", "FastFood", "Vegan", "GlutenFree", "Vegetarian"], message: "{VALUE} is not supported."}},
    description: {type: String, required: true},
    thumbnail: {type: String, required: true},
    creator: {type: Schema.Types.ObjectId, ref: 'User'},
    comments: [
        {
          content: { type: String, required: true },
          author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
          createdAt: { type: Date, default: Date.now },
        },
      ],
}, {timestamps: true})

module.exports = model('Post', postSchema)