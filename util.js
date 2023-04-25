/**
 * This is the util module used by other module.
 */
// Require node url module.
var http_url = require('url');
/* Function to parse client request query string and passe out related query parameter and value.*/
exports.getUrlParams = function(req, resp){

    req.query_url = http_url.parse(req.url, true);
    console.log(req.query_url);
    req.username = req.query_url.username;
    req.password = req.query_url.password;
    req.email = req.query_url.email;
    req.mobile_phone = req.query_url.mobile_phone;
    req.home_phone = req.query_url.home_phone;
}

/* This function will return web page navigation menu html source code. */
exports.pageMenu = function(){
    var ret = '<a href="/">Home</a>';
    ret += '&nbsp&nbsp';
    ret += '<a href="/register">Register</a>';
    ret += '&nbsp&nbsp';
    ret += '<a href="/login">Login</a>';

    return ret;
}
/* This function will use input parameter to replace place holder in the page template file. */
exports.buildPage = function(page_title, page_menu, page_content){

    var page_template = "<html>" +
        "<head>" +
        "<title>{page_title}</title>" +
        "</head>" +
        "<body>" +
        "<table>" +
        "<tr><td>{page_menu}</td></tr><tr>" +
        "<tr><td>{page_content}</td></tr>" +
        "</table>" +
        "</body></html>";

    var ret = page_template;
    ret = ret.replace("{page_title}", page_title, "g");
    ret = ret.replace("{page_title}", page_title, "g");
    ret = ret.replace("{page_menu}", page_menu, "g");
    ret = ret.replace("{page_content}", page_content, "g");
    return ret;

}
