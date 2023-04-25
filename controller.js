var http_util = require('./util');
const bcrypt = require('bcrypt');
const users = require('./data').users;
const salas = require('./data').salas;
const fs = require('fs');
const ejs = require('ejs');
// https://www.digitalocean.com/community/tutorials/how-to-use-ejs-to-template-your-node-application

exports.showHome = function buildIndexPage(req, resp, error_message) {
    // INTERESANTE https://stackoverflow.com/questions/44987804/nodejs-load-html-with-res-write
    var file = fs.readFileSync('./views/index.html', 'utf8');
    var html = ejs.render(file, {filename: 'index.html',
        producto: 'Producto 2',
        proyecto: 'JS y APIs de HTML5 Backend con NodeJS',
        title: 'Sala de juego',
        message:''});
    //console.log(html);
    resp.statusCode = 200;
    resp.setHeader('Content-type', 'text/html');
    resp.write(html);
    resp.end();
}

exports.showRegister= function (req, resp, error_message) {

    var file = fs.readFileSync('./views/register.html', 'utf8');
    var html = ejs.render(file,{
        filename: 'register.html',
        producto: 'Producto 2',
        /*proyecto: 'JS y APIs de HTML5 Backend con NodeJS',*/
        title: 'Sala de juego',
        message: ''}
    );
    resp.write(html);
    resp.end();
}
exports.registerSubmit = function (req, resp) {

    var query_string = require('querystring');
    if (req.method === 'POST') {
        var req_body = '';
        req.on('data', function (data) {
            req_body += data;
            // If the POST data is too much then destroy the connection to avoid attack.
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (req_body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', async function () {
            try {
                var post_data = query_string.parse(req_body);
                var username = post_data["username"];
                var email = post_data["email"];
                var password = post_data["password"];
                var password_confirm = post_data["password_confirm"];
                //upload.single('./images/avatar1.jpg');
                var imagen=post_data["avatar"];

                var foundUser = users.find((data) => email === data.email);
                var html;
                var file;
                var filename='register.html';
                var message='Usuario ya registrado, utilice otros datos.';
                var username;
                var email;
                // entre [0 y 10] ai
                //var imagen='./images/avatar'+Math.round(Math.random()*15)+'.jpg';

                if (password_confirm != password) {
                    producto: 'Producto 2';
                    message: 'Contraseñas no coinciden, repita.';
                }
                else if (!foundUser) {
                    let hashPassword = await bcrypt.hash(password, 10);
                    let newUser = { username: username, email: email, password: hashPassword, imagen: imagen };
                    users.push(newUser);
                    console.log('User list', users);
                    filename='login.html';
                    message='';
                    username: newUser.username;
                    email: newUser.email;
                    imagen=imagen;
                } else {
                    // volver a registro
                }
                var obj={filename: filename,
                    producto: 'Producto 2',
                    username: username,
                    email: email,
                    title: 'Sala de juego',
                    message: message,
                    imagen:imagen };
                file = fs.readFileSync('./views/'+filename, 'utf8');
                html = ejs.render(file,obj);
                resp.write(html);
                resp.end();
            } catch {
                resp.end("Internal server error");
            }
        });
    }
}

exports.showLogin=function(req, resp, error_message) {
    var file = fs.readFileSync('./views/login.html', 'utf8');
    var html = ejs.render(file,{
        filename: 'login.html',
        producto: 'Producto 2',
        /*proyecto: 'JS y APIs de HTML5 Backend con NodeJS',*/
        title: 'Sala de juego' }
    );
    //resp.statusCode = 200;    resp.setHeader('Content-type', 'text/html');
    resp.write(html);
    resp.end();
}
exports.loginSubmit = function(req, resp){
    // Use node query string module to parse login form post data.
    var query_string = require('querystring');
    // If client use post method to request.
    if (req.method == 'POST') {
        var req_body = '';
        req.on('data', function (data) {
            req_body += data;
            // If the POST data is too much then destroy the connection to avoid attack.
            // 1e6 === 1 * Math.pow(10, 6) === 1 * 1000000 ~~~ 1MB
            if (req_body.length > 1e6)
                req.connection.destroy();
        });
        req.on('end', async function () {
            try {
                // Parse post data from request body, return a JSON string.
                var post_data = query_string.parse(req_body);
                var email = post_data["email"];
                var password = post_data["password"];
                var foundUser = users.find((data) => data.email === email);
                var html;
                var file;
                if (foundUser) {
                    let submittedPass = password;
                    let storedPass = foundUser.password;
                    const passwordMatch = await bcrypt.compare(submittedPass, storedPass);
                    if (passwordMatch) {
                        file = fs.readFileSync('./views/juego.html', 'utf8');
                        html = ejs.render(file, {
                            filename: 'juego.html',
                            producto: 'Producto 2',
                            username: foundUser.username,
                            email: 'email',
                            title: 'Sala de juego- Página principal',
                            imagen:foundUser.imagen,
                            message: '',
                            users:users,
                            salas:salas
                        });
                    } else {
                        file = fs.readFileSync('./views/index.html', 'utf8');
                        html = ejs.render(file, {
                            filename: 'index.html',
                            producto: 'Producto 2',
                            proyecto: 'No se ha podido logear. Password inválido.',
                            title: 'Sala de juego- index',
                            imagen:foundUser.imagen,
                            message: 'Passwords no coinciden!'
                        });
                    }
                } else {
                    // let fakePass = `$2b$$10$ifgfgfgfgfgfgfggfgfgfggggfgfgfga`;
                    // await bcrypt.compare(req.body.password, fakePass);
                    file = fs.readFileSync('./views/index.html', 'utf8');
                    html = ejs.render(file, {
                        filename: 'index.html',
                        producto: 'Producto 2',
                        proyecto: 'No se ha podido logear.',
                        title: 'Sala de juego- index',
                        imagen:'',
                        message: 'Usuario no encontrado!'
                    });
                }
                resp.writeHead(200, {'Content-Type': 'text/html'});
                resp.write(html);
                resp.end();
            } catch{
                resp.end("Internal server error");
            }
        });
    }
}
exports.showLogout=function(req, resp, error_message) {
    var file = fs.readFileSync('./views/logout.html', 'utf8');
    var html = ejs.render(file,{
        filename: 'logout.html',
        producto: 'Producto 2',
        /*proyecto: 'JS y APIs de HTML5 Backend con NodeJS',*/
        title: 'Logout' }
    );
    //resp.statusCode = 200;    resp.setHeader('Content-type', 'text/html');
    resp.write(html);
    resp.end();
}
