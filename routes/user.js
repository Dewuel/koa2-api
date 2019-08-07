/**
 * @param router
 * @returns {void}
 */
module.exports = (router) => {
  router.prefix('/api/user')
  router.post('/signup', require('../controller/user').signup)
  router.post('/signin', require('../controller/user').signin)
  router.get('/userinfo', require('../controller/user').getUser)
}