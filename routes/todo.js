/**
 * @param router
 * @returns {void}
 */
module.exports = (router) => {
  router.prefix('/api')
  router.post('/add', require('../controller/todo').addTodo);
  router.post('/deleteTodo', require('../controller/todo').removeTodo);
  router.get('/getTodos', require('../controller/todo').getTodos);
  router.post('/updateTodo', require('../controller/todo').updateTodos);
};