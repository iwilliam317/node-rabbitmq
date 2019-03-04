const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')
const router = new Router()

const bodyParser = require('koa-bodyparser');

const amqp = require('amqplib/callback_api');

app.use(bodyParser())
router.get('/', async (ctx, next)=> {
    ctx.body = { message: 'Hello World from Koa'}
})

router.post('/send_message', async (ctx, next) => {
    const { message } = ctx.request.body
    await sendQueueMessage(message)
    ctx.body = message
})

app.use(router.routes())  

app.listen(process.env.PORT || 3000)

const sendQueueMessage = msg => {
    console.log(`Message queued!`)
    amqp.connect('amqp://localhost:5672', function (err, conn) {
        conn.createChannel(function (err, ch) {
            var q = 'hello';
            /* var msg = 'Hello World 123!'; */
            ch.assertQueue(q, { durable: false });     
            ch.sendToQueue(q, new Buffer(msg));
            console.log(" [x] Sent %s", msg);
        });
        setTimeout(function () { conn.close(); process.exit(0) }, 500);
    });
}