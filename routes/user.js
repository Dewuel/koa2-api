/**
 * @param router
 * @returns {void}
 */
module.exports = (router) => {
  router.prefix('/api')
  router.post('/signup', require('../controller/user').signup)
  router.post('/signin', require('../controller/user').signin)
  router.get('/userinfo', require('../controller/user').getUser)

  router.post('/add', require('../controller/todo').addTodo);
  router.post('/deleteTodo', require('../controller/todo').removeTodo);
  router.post('/getTodos', require('../controller/todo').getTodos);
  router.post('/updateTodo', require('../controller/todo').updateTodos);
}