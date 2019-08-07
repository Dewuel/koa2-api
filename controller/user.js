const User = require('../models/user')
const addToken = require('../scripts/addToken')
const checkToken = require('../scripts/checkToken')

class UserController {
  /**
   * 
   * @param {*} ctx 
   * @returns {Promise.<void>}
   */
  static async signup(ctx,next) {
    const { email, name, password, avatar } = ctx.request.body
    console.log(email, name, password, avatar);
    await User.create({ email, name, password, avatar }).then((res) => {
      ctx.status = 200
      ctx.body = {
        code: 200,
        msg: '注册成功',
        data: res,
      }
    }).catch(err => {
      console.log(err)
      ctx.status = 512
      ctx.body = {
        code: 512,
        msg: '邮箱已被占用',
        data: err
      }
    })
    await next()
  }

  static async signin(ctx,next) {
    const { email, password } = ctx.request.body
    await User.findOne({ email }, (err, res) => {
      if (err) throw err
      // User.comparePassword
      res.comparePassword(password, (err, isMatch) => {
        if (err) throw err
        if (isMatch) {
          let token = addToken(res)
          ctx.status = 200
          ctx.body = {
            code: 200,
            msg: '登录成功',
            data: {
              name: res.name,
              email: res.email,
              avatar: res.avatar,
              token: token
            }
          }
        } else {
          ctx.code = 505
          ctx.body = {
            code: 505,
            msg: '密码错误',
          }
        }
      })
    })
  await next()
  }

  static async getUser(ctx, next) {
    const auth = ctx.request.header.authorization;
    if (auth) {
      let decode = checkToken(auth)
      try {
        await User.findById(decode.id, (err, res) => {
          if (err) throw err
          ctx.status = 200
          ctx.body = {
            code: 200,
            msg: '获取成功',
            data: res
          }
        })
      } catch (err) {
        ctx.status = 408
        ctx.body = {
          code: 408,
          msg: '请重新登录',
          data: err
        }
      }
    } else {
      ctx.status = 404
      ctx.body = {
        code: 404,
        msg: 'token不存在'
      }
    }
    await next()
  }
}
module.exports = UserController