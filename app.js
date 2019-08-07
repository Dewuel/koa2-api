const Koa = require('koa')
const Router = require('koa-router')
const app = new Koa()
const router = new Router()

const views = require('koa-views')
const co = require('co')
const convert = require('koa-convert')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const debug = require('debug')('koa2:server')
const path = require('path')
const mongoose = require('mongoose');
const cors = require('koa2-cors')

const config = require('./config')
require('./routes/todo')(router)
require('./routes/user')(router)

const port = config.port || process.env.PORT

// error handler
onerror(app)
mongoose.connect(config.mongodbURI, {
  useNewUrlParser: true,
  useCreateIndex: true
}).then(() => {
  console.log('mongodb is connected!');
}).catch(err => {
  console.log(err);
})
app.use(cors({
  origin: function(ctx){
    return "*";
  },
  exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
  maxAge: 5,
  credentials: true,
  allowMethods: ['GET','POST','PUT'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept'],
}))
// middlewares
app.use(bodyparser())
  .use(json())
  .use(logger())
  .use(require('koa-static')(__dirname + '/public'))
  .use(views(path.join(__dirname, '/views'), {
    options: {settings: {views: path.join(__dirname, 'views')}},
    map: {'njk': 'nunjucks'},
    extension: 'njk'
  }))
  .use(router.routes())
  .use(router.allowedMethods())

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - $ms`)
})

router.get('/', async (ctx, next) => {
  // ctx.body = 'Hello World'
  ctx.state = {
    title: 'Koa2'
  }
  await ctx.render('index', ctx.state)
})

// routes(router)
// userRoute(router)
app.on('error', function(err, ctx) {
  console.log(err)
  logger.error('server error', err, ctx)
})

module.exports = app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
