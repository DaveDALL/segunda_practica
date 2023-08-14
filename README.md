# SEGUNDA PRACTICA INTEGRADORA.

A traves de este código, se pretende realizar la autentiación de un usuario, en primera instancia usando su correo electrónico y su contraseña; por lo que si no se encuentra registrado es posible que mediante un enlace, realizar un registro de usuario a través de un formulario donde se solicitará al usuario:

    - Nombre
    - Apellido
    - Correo electrónico
    - Contraseña

Una vez hecho el registro de usuario se redigirá al mismo hacia pagina de incio que es una ruta en **http://localhost:8080/**, donde se encuantra la página de login de usuarios.

Posteriormente, ya que el usuario se haya autentificado con su correo electrónico y contraseña,se redigirá hacia la página de products.

Por otro lado, también es posible realizar una autenticación a través de **github**, donde se realiza la configuración de la estrategia y router para realizar la solicitud de autenticación hacia github; donde una vez autentificado se almacena la información del usuario como correo electronico y nombre en la base de datos de MongoDB (no se almacena en ningun momento la contraseña). También es importante que el usuario que emplee este método de autenticación, tenga con visibilidad pública su nombre y correo electrónico.

Nota: Se crea un middlware que verifica si el usuario se encuentra en sesion para hacer el direccionamiento hacia la página de products, si se encuentra dentro de la sesión, podra ser direccionado a la ruta **http://localhost:8080/products**. En caso de que la sesion del usuario no esté activa, a pesar de que escriba en el navegador la ruta de productos NO podrá acceder a esta, y lo redigirá hacia la vista de login.

## EXPRESS SESSION

Para poder realizar el manejo de la sesión para el manejo de datos de usuario, se ocupa express-session, habilitando el middleware mediante app.use, usando el siguiente código en el index.js

```javascript

app.use(session({
    secret: 'secrecto de encriptación',
    resave: true,
    saveUninitialized: true
}))

```

La persistencia de la sesión se realiza con la dependencia connect-mongo, hacia la base de datos de MongoDB y la colección por default de **sessions**.

## CONNECT-MONGO

La persistencia de la sesión se realza medniante la conexión a la base de datos mongoDB, en la colección por defecto **sessions**, por lo que al objeto que se usa como parámentro de session, se agrega el key store, indicando que el almacenamiento de la sesión será en MongoDB.

```javascript

app.use(session({
     store: MongoStore.create({
        mongoUrl: 'URL de la base de datos en MongoDB ',
    }),
    secret: 'secrecto de encriptación',
    resave: true,
    saveUninitialized: true
}))

```


## HANDLEBARS (MOTOR DE PLANTILLAS)

Mediante el uso de handlebars como motor de plantillas, para crear una página estática para un chat, donde la comunicación se realiza a través de websockets, donde se crea un formulario para recibir los datos del nombre de usuario que es el correo electrónico del usuario mediente un form input, y el texto del mensaje a través de un texarea. Se realiza un submit de estos datos usando un botón que dispara el evento submit; el formulación a su vez ejecuta el evento onsubmit que ejecuta la función correspondiente para dar formato al mensaje, mediante el objeto messaging como **{user: recibe el valor del input box username, message: recibe el valor del textarea usermessage}**.

Para essto se crea una carpeta de vistas llamada **views**, en la ruta raíz, donde se alberga el archivo **main.handlebars.js** en la carpeta de **layout**; por otro lado en la crapeta de views, se crea el archivo **chat.handlebars.js**, donde realiza el diseño del formulario.

Para la vista de products, se crea un router de productos a través del cual se direccionará hacia la ruta de la vista de productos, ubicado en **/products**; y mediante el uso de un archivo **products.handlebars**, se colocan las etiquetas html para colocar los botones de visualizar el carrito, pagina siguiente y pagina anterior, y el render de las trajetas de productos. La lógica se realizará desde el archivo **products.js**, donde se albergará las líneas de código para realizar los fetch correspondientes hacia la base de datos, colección products y poder descargar los documentos correspondientes a los productos existentes mediante el método get, para poder visualizarlos en la vista de productos. Ademas dentro de esta vista será posible agregar los productos de uno en uno al carrito de compra y almacenarse en la base de datos de la colección carts, através de uso del metodo put, y crear un nuevo carrito mediante el metodo post; estos métodos realizan un fetch hacia los endpoints correspondientes.

El el archivo productos.js, se cuenta con una variable global cartId que es el id de carrito de compras, de momento este valor está inicializado con el id de un carrito que esta en la base da datos MongoDB Atlas, de la collección carts con id **'64b522c4d5b51e2d98a0fa81'**, por lo que si se quiere interactuar con la creación de un nuevo carrito cada vez que se recargue la pagina, se tendra que inicializar con el valor de **undefined**.


Para la vista de carts, de la misma forma se cre aun router para direccionar hacia la vista de cart, ubicado en **/carts/:cid**, donde cid representa el cart actual de compra, es valor se carga de forma automática cuando da clic en el boton de viaualizar carrito en la vista de productos, el cual abrira una pestaña nueva con la vista del carrito mostrando los datos generales del producto, los cuales se descargan de la base de datos, de la colección carts, mediante el fetch hacia el endpoitn correspondiente.

Además, se implementa una vista de autenticación para realizar:

- Login. Se usa formulario con método POST hacia el endpoint de **/authLogin**, que verifica si el usuario está registrado en la base de datos. Dentro de esta vista se agrega un botón para realizar la autenticación de terceros hacia github.
    
- Registro de usuario. De igual forma se usa un formulario con método POST hacia el endpoint de **/authRegistration**, donde se hace el registro de usuario hacia la base de datos.

## WEBSOCKETS

Se usará la aplicación de sockets.io para realizar la comunicación a través de http 8080. Del lado del servidor se crea un router que contendrá en endpoint GET, llamado **chat.router.js** como función que recibirá desde el index.js del servidor, ubicado en la ruta raíz, la constante **io** que recibe **socket.io**. 

En el endpoint, se realiza la recepción del mensaje enviado por el cliente medinate el evento **chatMessage**, este mensage se almacena en un array llamado **allMessages**, donde se realuzará el push de los mensajes envien los clientes; posteriormente se emitirá a los clientes, mediante el evento **allMessages**, para mostrar el seguimiento de los mensajes. Una vez cerrada la conexión por parte de cliente mediante el botón de **Finalizr chat** que dispara la función **socket.disconnect()** del lado del cliente, se almacenarán los mensajes en el mongoDB Atlas, en una colleción llamada messages.

Por el lado del cliente, socket.io, se instala mediante el uso del script **<script src="/socket.io/socket.io.js"></script>**, colocado en el archivo de chat.handlebars.js; por otro lado se usa el archivo **chat.js** para realizar la lógica de programación, para instanciar socket.io mediante la constante **socket**,  recibir los datos del formulario, formateo y creación del objeto de messaging, y emisión hacia el servidor mediante el evento **chatMessage** enviando el objeto messaging. También se realiza la función para recibir el evento **allMessages** enviado por el servidor con el arreglo de los mensajes a cumulados, y relizar el render de la vista de los mensajes; y la función para deconexión del cliente y poder enviar los mensajes acumulados a la base de datos mongoDB Atlas en la colección messages.

## EXPRESS ROUTER

Mediante el uso de Routers de express, se crean los endopint para products y carts. 

1. Ruta de vistas. Se cuenta con la siguientes rutas de vistas:

- Tres rutas GET para renderizar las vista generadas por el motor de plantillas handlebars, hacia el registro de usuarios, login, y logout.

2. Un router de auth para los endpoints para validar el registro de usuarios, login, y logout. En el endpoint de registro de usuario se realiza el registro de la información del usuario emplenado el siguiente modelo hacia la colección users:

```javascript

userName: {
        type: String,
        trim: true,
        required: true,
    },
    lastName: {
        type: String,
        trim: true,
    },
    userMail: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    userPassword: {
        type: String,
        trim: true,
    },
    cartId : {
        type:[cartIdSchema]
    },
    userRoll : {
        type: String,
        required: true,
    }

```

Un endpoint de login, que hace la interacción con la colección de users para buscar al usuario y con la colección sessions, para el almacenamiento de los datos del usuario mediante la persitencia en MongoDB. Si se loguea el administrador se observa el rol de admin; ademas el admin esta hardcodeado en router de auth, por lo que no esta en la base de datos.

Se implementa passport y JWT (JSON Web Token) para realizar la autorización de acceso a la vista de porudctos. Para esto se crea una estrategia de passport para JWT, que validará el token que se almanacena en una cookie llamada jwtCookie, posterior a la validación correcta de la información de contraseña hasheada en la base de datos con la contraseña introducida en formulario de login. Para la creación de la cookie se usa cookie parser.

3. Para el caso de los products en el index.js se crea un middleware para usar el router, archivo **product.router.js** de productos con la ruta **/api/products/**, y crean los siguientes endpoints:

- GET de todos los productos con la ruta **/**, que realiza la busqueda en la base de datos de mongoDB Atlas, y devuelve todos los productos existentes.
- GET de producto por el ID, en la ruta **/:pid**, donde pid es el ID de productos generado por mongoDB Atlas. 
- POST que crea un producto nuevo, en la ruta **/newproduct**, y este a su vez realiza la creación de un nuevo documentos en la base de datos Atlas, enviando un objeto, en el body en JSON, de la forma:

```JSON

{
    "code": String,
    "title": String,
    "description": String,
    "thumbnails": [Arreglo con los links de la imagen o imangenes],
    "price": Number,
    "stock": Number,
    "status": Boolean,
    "category": String
  }

```

- POST que realiza la actualización de un producto, en la ruta **/:pid**, donde pid es el parámetro del ID del producto que se quiere actualizar. El ID del producto, es el id generado por MongoDB Atlas al momento de realizar la creación del documento. SE objeto de forma anterior con la actualización de los datos requeridos.
- DELETE, con la ruta **/:pid** que realiza la eliminación de un producto en la base de datos mongoDB Atlas

4. Para el caso de carts, en el index.js se crea un middleware para usar el router **cart.router.js**, con la ruta **/api/carts**, donde se crean los siguientes endpoints:

- GET con la ruta **/:cid** donde cid es el params que se recibe con el ID de cart que se generó en la base de datos Atlas cuando se creao un cart nuevo, esto para obtener un cart por su ID.
- POST para crear un carrito nuevo, con la ruta **/newcart**, el cart se crea con el arrego de productos vacio, quedando de la forma:

```javascript

{
    products: []
}

```

Cuando se crea el documento en la base datos Atla, se genera un ID del cart automáticamente.

- POST en la ruta **/:cid/product/:pid**, que agregará un producto nuevo que no este en el cart, o actualizar el producto si ya sencuentra en el cart. Los params, cid representa el ID del cart y pid es el ID del producto. Por lo que en el body en JSON se recibira un objeto:

```JSON

{
    "qty": Number
}

```

Donde qty es la cantidad de items del mismo producto. el ID del producto es el que genero en mongoDB Atlas cuando se registro el producto.

Si el pid no exite, se agregará al cart el producto junto con su cantidad en la forma  objeto {_id: pid. qty: qty}; si el producto ya existe solo se modificará la cantidad.

- Se crea un endpoint para agregar o actualizar un producto desde la ruta **/:cid/products**, donde enviar un objeto de la siguiente forma

```JSON

{
    "productId": "id del producto de la base datos products",
    "qty": Number
}

```

- POST para borrar un producto del cart, en la ruta **/:cid/delproduct/:pid**. Mediante este endpint se elimará un producto del documento de cart de la colección carts de Atlas.
- DELETE para borrar un cart de la colección carts, en la ruta **/delcart/:cid**, el endpoint eliminará el documento cart de la colección carts.

## MONGOOSE

Se empleará Mongoose como para el modelado de los datos, para esto primero se realiza conexión a la base da datos en el archivo **db.js** ubicado en la ruta **/dao**.

Se crearan los esquemas para el modelado de los datos de carts, products y messages, elaborando los archivos **modelCart.js, modelProduct.js y modelMessage.js**, respectivamente. 

- El esquema del productos del carts se crea con el siguiente formato de datos, con el nombre de cartProductSchema:

```javascript

{
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }
    qty: {
        type: Number
    }
}

```
Esto con la finalidad de implementar populate mediante elmétodo findOne, en el esquema de cart y hacer referencia a los productos con el esquema Products.

asi mismo este esquema se lleva al esquema de carts de la siguiente forma:

```javascript

{
    products: [cartProductSchema]
}

```

- El esquema de productos se define de la siguiente forma:

```javascript

{
    code: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    thumbnails: {
        type: Array,
        default: [],
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    status: {
        type: Boolean,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}

```

Además dentro del esquema de productos se integra la paginación mediante el uso del plugin mongoose aggregate paginate v2.
con aggregate se podran hacer los stages para poder establecer un limite, ordenar por precio, y filtrado por categoria o existencia

- Y el esquema de mensajes primero se define el mensaje se colocará dentro del arreglo de mensajes, son el nombre de messageTypeSchema:

```javascript

{
    user: {
        type: String
    },
    message: {
        type: String
    }
}

```

Y en el esquema del arreglo de mensajes se define de la siguiente manera:

```javascript

{
    messages: [messageTypeSchema]
}

```

## BCRYPT

Se realiza la integración de bcrypt, a fin de realizar un hasheo de la contraseña del usuario, en **/util/bcrypt**, donde se implementan las funciones para realizar la encriptación de la contraseña de usuario, y  para realizar la comparación de la contraseña introducida por el usuario, contra la contraseña registrada en MondoDB, la cual se encuentra encriptada.

## PASSPORT, PASSPORT-GITHUB2 Y PASSPORT-JWT

Se implementa passport y la estrategia de passport-github2, para poder realizar una autenticación de terceros mediante gihub. La estrategia se encuentra en el archivo en **/config/passportGit.config.js**. quedando de la siguiente forma:

```javascript

passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "URL del callback"
  }, async (accessToken, refreshToken, profile, done) => {
        //código para identificar la existencia del usuario en MongoDB
        // Si no existe el usuario se crea uno nuevo
        done(null, user)
        //en la posción de user se enviar el usuario encontrado en MongoDB
        //o el usuario creado en MongoDB
  }))

```

Para activar la opción de poder integrar el usuario de github del Ecommerce, es importante realizarlo en la opción de settings del profile del Ecommerce, en la opción de developers, donde cre introducen los datos del URL de la pagina web del Ecommerce,se crea el Client ID y el Client Secret; y se coloca la URL del calback.

**Es importante que tanto en la creación de la aplicación en github, como en la estrategia y en la ruta del router de github, la ruta del callback sea igual en estos 3 lugares**.

A través de la estrategia se realiza la consulta hacia github por los datos de usuario. Para realziar la consulta se usa un router que apunta hacia el endpoint **/github**, donde se implementa passport para realizar la autenticación y usar la estrategia de github, empleando un scope de usuario con el correo electronico, y la sesion en false, ya que session se implementa de forma independiente, para poder hacer la persistencia de sesiones con MongoDB.

Una vez que el usuario realiza el login mediante github, se manda a llamar la ruta de callback, para almacenar en session la información del usuario obtenida por la estrategia de github, y poder hacer la revisión de autenticación mediante el middleware en el router de la vista de productos, una vez que se sabe que el usuario esta autentificado correctamente se redirige hacia la vista de productos.

A través de la estrategia de github, se recolecta la información del usuario de github, y se agrega a la base de datos en caso de que no se encuentre registardo, para esto en el campo de userPassword no se almacena ninguna información. Punto importante a tomar en cuenta, nuevamente, es que **tanto el nombre de usuario como el correo electrónico tengan visibilidad pública a fin de poder recopilar la información**. Mediante la función **done(null, user)** de la estrategia, se recibe en el callback la información del usuario mediante **req.user**.

Para el caso de la estrategia de JWT se crea un archivo en **/config/passportJwt.config.js**, mediante esta estrategia, se implementa un extractor de cookies, de tal forma que se puede comparar el token contenido en la cookie con nombre **jwtCookie**, con el token del usuario generado con JWT. Quedando la estrategia de la siguiente forma:

```javascript

passport.use('jwtAuth', new JWTStartegy({
        jwtFromRequest: JWTExtract.fromExtractors([cookieExtractor]),
        secretOrKey: 'secreto'
    }, async (jwt_payload, done) => {
        try {
            return done(null, jwt_payload)
        } catch(err) {
            return done(null, err)
        }
    })

```

y donde la función extractora será de la siguiente forma:

```javascript

const cookieExtractor = (req) => {
    let token = null
    if(req && req.cookies) {
        token = req.cookies['Cookie creada en el login']
    }
    return token
}

```

Durante el proceso de login, se crea la cookie empleando **cookie-paser** y el token del usuario mediante JWT, meante el usu de un 'secreto', el cual tiene que coincidir con el de que usa en la estrategia de JWT, el cual se incializa en el index.js principal. 

**Para cerrar el proceso al momento de realizar el logout, se destruye la sesion de datos del usuario y la cookie que contine el token de autorización**.


# FIN

