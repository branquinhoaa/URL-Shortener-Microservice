var validate = require("valid-url");
var origUrl = require("./mongoConn.js").getOriginalLink;
var shortUrl = require("./mongoConn.js").generateShortUrl;
var url=require("url");


module.exports = function(app) {
    app.route('/')
        .get(function(req, res) {
            res.sendFile(process.cwd() + '/index.html');
        });
    app.route('/favicon.ico')
        .get(function(req, res) {
            res.send();
        });
    app.get('/new/:url*', function(req, res) {
            var path = (req.url).substring(5);
            console.log(req.url);
            console.log(path);
            var validUrl = valid(path);
            console.log(validUrl)
            
            if (validUrl) {
                shortUrl(path, function(err, random) {
                    if (err) {
                        console.log(err);
                    }
                    res.setHeader('Content-Type', 'application/json');
                    res.send(JSON.stringify({
                        'original link': path,
                        'short link': req.params.url+ req.get('host')+"/new/"+random
                    }, null, 3));
                });
            } else if (path.length === 8) { //verificar se está no bd e nao o length

                origUrl(path, function(err, link) {
                    if (err) {
                        console.log('error inside a redirect to original url');
                    }
                    console.log("link is: " +link);
                    res.redirect(link);
                    res.end();
                });
            } else {
                res.setHeader('Content-Type', 'application/json');
                res.send(JSON.stringify({
                    'original link': path,
                    'short link': 'this is not a valid link! please try again! (you will need to type --> http://)'
                }, null, 3));
            }
        });
};


function valid(url) {
    if (validate.isUri(url)) {
        return true;
    }
    return false;
}