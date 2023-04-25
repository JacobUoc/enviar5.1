const http = require('http');
const controller=require('./controller');
var path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const hostname = '127.0.0.1';
const port = 3000;
var http_util = require('./util');
var dir = path.join(__dirname, 'images');
// D:\home\javaprojects\eclipse-projects\2023-03-01-jacobo-fullstack\p2-sala-juego\images
const mime = {
    html: 'text/html',
    txt: 'text/plain',
    css: 'text/css',
    gif: 'image/gif',
    jpg: 'image/jpeg',
    png: 'image/png',
    svg: 'image/svg+xml',
    js: 'application/javascript'
};
// path.delimiter=";" path.sep="\"
    var callback = function(req, resp){

    // Parse query strings.
    http_util.getUrlParams(req, resp);

    // Get request url path value.
    var url_path = req.query_url.pathname;

    //   R O U T E R req.url también vale "/"
    if(url_path === '/') {
        controller.showHome(req, resp);         //controller.showHomePage(req, resp);
    }else if(url_path === '/login' ) {
        controller.showLogin(req, resp);        //controller.showLoginPage(req, resp);
    }else if(url_path === '/login-submit') {
        controller.loginSubmit(req, resp);      //controller.checkLoginAccount(req, resp);
    }else if(url_path === '/register') {
        controller.showRegister(req, resp);     //controller.showRegisterPage(req, resp);
    }else if(url_path === '/register-submit') {
        controller.registerSubmit(req, resp);   //controller.registerSubmitOld(req, resp);
    } else if(url_path === '/logout' ) {
            controller.showLogout(req, resp);        //controller.showLoginPage(req, resp);
    } else if  (url_path === "/data") {
        // Send JSON, dummy payload
        const payload = {
            address: {
                street: "123 amazing street",
                city: "Fun City"
            }
        };
        resp.writeHead(200, { "Content-Type": "application/json" });
        resp.write(JSON.stringify(payload));
        resp.end();
    } else if ( (url_path.indexOf('.jpg') != -1) ||
        (url_path.indexOf('.jpeg') != -1) ||
        (url_path.indexOf('.png') != -1) ||
        (url_path.indexOf('.gif') != -1) )
    {
    // si recibo http://localhost:3000/images/avatar1.jpg
        // url_path es /images/avatar1.jpg
        fs.readFile(`.`+url_path, (error, data) => {
            if (!error) {
                var l=url_path.split('.').length;
                var type=url_path.split('.')[l-1];
                // también const ext = fileName.toLowerCase().split('.').slice(1).pop();
                // slice devuelve copia array dentro de un array existente desde pos 1
                // pop() elimina el último elemento de un array y lo devuelve.
                resp.writeHead(200, { "Content-Type": String("image/"+type) });
                resp.end(data);
            } else {
                console.log(error);
                resp.writeHead(404);
                resp.end('404 - File Not Found');
            }
        });
    } else {
        resp.writeHead(404, {'Content-Type' : 'text/html'});
        resp.end("Request url is not valid : " + req.url.toString());
    }
}

// Create a http web server use above callback function.
var app = http.createServer(callback);

app.listen(port, hostname, () => {
    console.log(`Server running at http://${hostname}:${port}/`);
});





