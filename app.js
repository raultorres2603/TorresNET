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

app.get('/logout', function (req, res) {
    sess = undefined;
    req.session.destroy();
    res.redirect('/');
});

app.post('/auth', function (req, res) {
    const username = req.body.usuario;
    const password = req.body.contrasena;

    if (username == "" || password == "") {
        res.redirect('/');
    } else {
        con.query('SELECT idusuario FROM usuario WHERE name_usuario = ? AND pass_usuario = ?', [username, password], function (error, results, fields) {
            if (error) {
                res.redirect('/?error_select=1');
            } else if (results.length > 0) {
                sess = req.session;
                sess.username = username;
                res.redirect('/');
            } else {
                con.query('INSERT INTO usuario(name_usuario,pass_usuario) VALUES (?,?)', [username, password], function (error, results, fields) {
                    if (error) {
                        res.redirect('/?error_insert=1');
                    } else {
                        sess = req.session;
                        sess.username = username;
                        res.redirect('/');
                    }
                });
            }
        });
    }

});

app.post('/question', function (req, res) {
    const question = req.body.question;

    con.query('SELECT idusuario FROM usuario WHERE name_usuario = ?', [sess.username], function (error, results, fields) {
        if (error) {
            res.redirect('/');
        } else {
            con.query('INSERT INTO preguntas_usuarios(pregunta_usuarios,usuario_usuarios) VALUES (?,?)', [question,sess.username], function (error, results, fields) {
                if (error) {
                    res.redirect('/');
                } else {
                    res.redirect('/?error_preg=0');
                }
            });
        }
    });
    res.redirect('/');

});


server.listen(3000, function () {
    console.log("Server running on Node.js");
})
