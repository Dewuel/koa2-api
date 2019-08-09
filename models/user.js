const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const SALT_WORK_FACTOR = 5
const Schema = mongoose.Schema

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
  },
  status: {
    type: Number,
    required: true,
    default: 1 // 1=>正常, 2=>异常
  },
},{
  timestamps: true
})

UserSchema.pre('save', function(next){
  let user = this
  if(!user.isModified('password')) return next();
  // if(!user.isNew) return next()
  // 生产salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt){
    if(err) return next(err);
    // 结合salt产生hash
    bcrypt.hash(user.password, salt, function(err, hash){
      if(err) return next(err);

      // 使用hash代替铭文密码
      user.password = hash
      next()
    })
  })
})

// 解密
UserSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err) return cb(err)
    cb(null, isMatch)
  })
}

// UserSchema.statics()

module.exports = mongoose.model('User',UserSchema)