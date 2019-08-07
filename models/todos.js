const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TodoSchema = new Schema({
  todo: {
    type: String,
    required: true
  },
  status: {
    type: Number,
    default: 0 // 0=>未完成，1=>已完成，2=>已删除，3=>已修改
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user'
  }
},{
  timestamps: true
})

// TodoSchema.pre('save', function(next){
//   let todo = this
//   if(todo.userId) return next()
// })

module.exports = mongoose.model('Todo', TodoSchema)