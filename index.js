const express = require('express'); //importacion de express
const routes = require('./routes'); //importacio  de las rutas almacenadas en routes
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

//importar variables
require('dotenv').config({ path: 'variables.env'})

// helpers con algunas funciones
const helpers = require('./helpers');

// Crear la conexión a la BD
const db = require('./config/db');

// Importar el modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync({alter: true})
    .then(() => console.log('Conectado al Servidor'))
    .catch(error => console.log(error));

// crear una app de express
const app = express();

// Donde cargar los archivos estaticos
app.use(express.static('public'));

// Habilitar Pug
app.set('view engine', 'pug'); // aqui indico que trabajeremos con el motor de desarrollo pug

// habilitar bodyParser para leer datos del formulario

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Agregamos express validator a toda la aplicación
app.use(expressValidator());



// Añadir la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



app.use(cookieParser());

// sessiones nos permiten navegar entre distintas paginas sin volvernos a autenticar
app.use(session({ 
    secret: "keyboard cat", 
    resave: false, 
    saveUninitialized: false 
}));


app.use(passport.initialize());
app.use(passport.session());

// agregar flash messages
app.use(flash());

// Pasar var dump a la aplicación
app.use((req, res, next) => {
    res.locals.vardump = helpers.vardump;
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
});


app.use('/', routes() ); //accediendo a las vistas y todas las rutas que se encuentran en routes

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


app.listen(port,host, () => {
    console.log('El servidor esta funcionando')
});