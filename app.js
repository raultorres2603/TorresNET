var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
const path = require('path');
const mysql = require('mysql');
const pug = require('pug');
var session = require('express-session');
// Variable de sesión
var sess;
const bodyParser = require('body-parser');
const EventEmitter = require('events');
const { resolveMx } = require('dns');
const myEmitter = new EventEmitter();
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'pug');

//SESSIONS SSH
app.use(session({ secret: 'ssshhhhh' }));


app.use(express.urlencoded({
    extended: true
}))

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "torresnet"
});

// -----------------------------------------------------------------------------------------------

app.get('/', function (req, res) {
    // Si la sesion de login existe
    if (typeof sess !== 'undefined') {
        res.render(path.join(__dirname, './public/views/index.pug'), {
            title: 'TorresNET',
            esconder: 'none',
            texto: 'Bienvenido ' + sess.username,
            logout: 'logout',
            log_view: 'block'
        });
    } else {
        res.render(path.join(__dirname, './public/views/index.pug'), {
            title: 'TorresNET',
            buton_entrar: 'Entrar',
            esconder: 'block',
            texto: 'Únete a nosotros',
            log_view: 'none'
        });
    }
});

app.get('/logout', function (req, res) {
    sess = undefined;
    req.session.destroy();
    res.redirect('/');
});

app.post('/auth', function (req, res) {
    const username = req.body.usuario;
    const password = req.body.contrasena;

    console.log(username, password);

    con.query('SELECT idusuario FROM usuario WHERE name_usuario = ? AND pass_usuario = ?', [username, password], function (error, results, fields) {
        if (error) {
            throw error;
        } else if (results.length > 0) {
            sess = req.session;
            sess.username = username;
            res.redirect('/');
        } else {
            con.query('INSERT INTO usuario(name_usuario,pass_usuario) VALUES (?,?)', [username,password], function (error, results, fields) {
                if (error) {
                    throw error;
                } else {
            sess = req.session;
            sess.username = username;
            res.redirect('/');
                }
            });
        }
    });

});

app.post('/question', function (req, res) {
    const question = req.body.question;
    // CREAR SALA DE ADMIN POR USUARIO... SOCKETS ROOMS Y DEMÁS!
    res.redirect('/');
});


server.listen(3000, function () {
    console.log("Server running on Node.js");
})
