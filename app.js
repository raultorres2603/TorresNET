const express = require('express');
const path = require('path');
const server = express();
const mysql = require('mysql');
const pug = require('pug');
var session = require('express-session');
// Variable de sesión
var sess;
const bodyParser = require('body-parser');
const EventEmitter = require('events');
const { resolveMx } = require('dns');
const myEmitter = new EventEmitter();
server.use(express.static('public'));

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));
server.set('view engine', 'pug');

//SESSIONS SSH
server.use(session({ secret: 'ssshhhhh' }));


server.use(express.urlencoded({
    extended: true
}))

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "torresnet"
});

// -----------------------------------------------------------------------------------------------

server.get('/', function (req, res) {
    // Si la sesion de login existe
    if (typeof sess !== 'undefined') {
        res.render(path.join(__dirname, './views/index.pug'), {
            title: 'TorresNET',
            esconder: 'none',
            texto: 'Bienvenido ' + sess.username,
            logout: 'logout',
            log_view: 'block'
        });
    } else {
        res.render(path.join(__dirname, './views/index.pug'), {
            title: 'TorresNET',
            buton_entrar: 'Entrar',
            esconder: 'block',
            texto: 'Únete a nosotros',
            log_view: 'none'
        });
    }
});

server.get('/logout', function (req, res) {
    sess = undefined;
    req.session.destroy();
    res.redirect('/');
});

server.post('/auth', function (req, res) {
    const username = req.body.usuario;
    const password = req.body.contrasena;

    console.log(username, password);

    con.query('SELECT idusuario FROM usuario WHERE name_usuario = ? AND pass_usuario = ?', [username, password], function (error, results, fields) {
        if (error) {
            throw error;
        } else if (results.length > 0) {
            sess = req.session;
            sess.username = username;
            res.redirect('/?error=false');
        } else {
            res.redirect('/?error=true');
        }
    });

});

server.listen(3000, function () {
    console.log("Server running on Node.js");
})
