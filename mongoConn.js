var mongo = require('mongodb').MongoClient;
var url = process.env.MONGOLAB_URI;
var crypto = require("crypto");


module.exports = {
    getOriginalLink: function(shortURL, callback) {
        mongo.connect(url, function(err, db) {
            if (err) {
                console.log(err)
            }
            var collection = db.collection("shortUrls");
            collection.find({
                shortedLink: shortURL
            }).toArray(function(err, documents) {
                if (err) {
                    console.log('err')
                }
                var ol= documents[0]['originalLink'];
                callback(null, ol);
                db.close();
            })
        })
    },

    generateShortUrl: function(path, callback) {
        console.log('Connecting to mongo: ', url)
        mongo.connect(url, function(err, database) {
            if (err) {
                console.log(err);
                callback(err);
            }
            else {
                var random = crypto.randomBytes(4).toString('hex');
                var col = database.collection('shortUrls');
                col.insert({
                    'originalLink': path,
                    'shortedLink': random
                });
                callback(null, random);
            }
            console.log("that's all");
            database.close();
        });
    }
};
