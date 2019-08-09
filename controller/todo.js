const Todo = require('../models/todos')
const checkToken = require('../scripts/checkToken')

class Todos {
  /**
   * 
   * @param {*} ctx 
   */
  static async addTodo(ctx) {
    const { todo } = ctx.request.body
    console.log(todo)
    const auth = ctx.request.header.authorization;
    if (auth) {
      let decode = checkToken(auth)
      // let newTodo = new Todo({
      //   todo: todo,
      //   userId: decode.id
      // })

      await Todo.create({ todo: todo, userId: decode.id }).then(res => {
        ctx.status = 200
        ctx.body = {
          code: 200,
          msg: '添加成功',
          data: {
            id: res._id,
            todo: res.todo
          }
        }
      }).catch(err => {
        console.log(err)
      })
    } else {
      console.log('token 不存在')
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'token 不存在'
      }
    }
  }

  /**
   * 
   * @param {*} ctx 
   */
  static async removeTodo(ctx) {
    const { id, uid } = ctx.request.body
    const auth = ctx.request.header.authorization
    if (auth) {
      let decode = checkToken(auth)
      if (decode.id !== uid) return;
      try {
        await Todo.findByIdAndRemove({ _id: id }, (err) => {
          if (err) throw err;
          ctx.status = 200
          ctx.body = {
            code: 200,
            msg: '删除成功',
          }
        })

      } catch (err) {
        ctx.status = 406
        ctx.body = {
          code: 406,
          msg: '删除失败',
          data: err
        }
      }
    }
  }

  /**
   * 
   * @param {*} ctx 
   */
  static async getTodos(ctx) {
    const auth = ctx.request.header.authorization
    const { id } = ctx.request.body
    if (auth) {
      let decode = checkToken(auth)
      if (decode !== id) return;
      try {
        await Todo.find({ userId: decode.id }, (err, res) => {
          if (err) throw err;
          ctx.status = 200
          ctx.body = {
            code: 200,
            msg: '查找成功',
            data: res
          }
        })
      } catch (err) {
        ctx.status = 403
        ctx.body = {
          code: 403,
          msg: '查找失败',
          data: err
        }
      }
    }
  }

  /**
   * 
   * @param {*} ctx 
   */
  static async updateTodos(ctx) {
    const { id, uid, todo } = ctx.request.body
    const auth = ctx.request.header.authorization
    if (auth) {
      let decode = checkToken(auth)
      if (uid !== decode.id) return;
      try {
        await Todo.findByIdAndUpdate(id, { todo: todo }, (err, res) => {
          if (err) throw err;
          ctx.status = 200;
          ctx.body = {
            code: 200,
            msg: '修改成功',
            data: res
          }
        })
      } catch (err) {
        ctx.status = 406;
        ctx.body = {
          code: 406,
          msg: '修改失败',
          data: res
        }
      }
    }
  }
}

module.exports = Todos;