const express = require('express')
const app = express()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const cookieParser = require('cookie-parser')
const http = require('http')
const server = http.createServer(app)
const handlebars = require('express-handlebars')
const Database = require('./dao/db')
const {Server} = require('socket.io')
const io = new Server(server)
const productRouter = require('./routers/product.router')
const cartRouter = require('./routers/cart.router')
const chatRouter = require('./routers/chat.router')(io)
const productViewRouter = require('./routers/productView.router')
const cartViewRouter = require('./routers/cartView.router')
const viewsRouter = require('./routers/views.router')
const authRouter = require('./routers/auth.router')
const gitRouter = require('./routers/gitHub.router')
const initializePassportGit = require('./config/passportGit.config')
const passport = require('passport')
const initializePassportJwt = require('./config/passportJwt.config')
const MONGOURL = 'mongodb+srv://manager:CoderHouse92857@clustervirtus.0ez8je4.mongodb.net/ecommerce'
const PORT = 8080

//middleware de archivos estaticos publicos, JSON y encoding
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

//Configuracion de Handlebars
app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views')

//Configuración de express session y almacenamiento en MongoDB
app.use(cookieParser())
app.use(session({
    store: MongoStore.create({
        mongoUrl: MONGOURL,
    }),
    secret: 'l4gr4ns3ns4c10nd3l4lb3r1c0qu3',
    resave: true,
    saveUninitialized: true
}))

//inicializar passport
app.use(passport.initialize())
initializePassportGit()
initializePassportJwt()

//middleware de router
app.use('/api/products', productRouter)
app.use('/api/carts', cartRouter)
app.use('/chat', chatRouter)
app.use('/products', productViewRouter)
app.use('/carts', cartViewRouter)
app.use('/', viewsRouter)

//Auth Routers
app.use('/', authRouter)
app.use('/auth', gitRouter)

server.listen(PORT, () => {
    console.log(`Server listenning at port ${PORT}`)
    Database.connect()
})