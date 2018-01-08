const mongodb = require("mongodb");
const dbURI = require("./configVariables").dbURI;

module.exports = (cb) => {

    mongodb.MongoClient.connect(dbURI, {
        promiseLibrary: Promise
    }, (err, database) => {
        if (err) {
            console.log(err);
            console.log('Mongo connection failed., why don\'t you check your configVariable.js file.');
            process.exit(1);
        }
        console.log("Successfully connected to mongo.");
        cb(database);
    });
};
