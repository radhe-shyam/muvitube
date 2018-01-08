let express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    promise = require('bluebird');


global.Promise = promise;
global.app = app;
app.disable('x-powered-by');

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

require('./app/routes');

app.use((req, res, next) => {
    res.status(404).send('You\'re lost.');
});

app.use(require('./app/errorHandler'));


app.start = () => {
    require('./config/database')((db) => {
        app.db = db;

        let server = app.listen(process.env.PORT || 5000, () => {
            let port = server.address().port;
            console.log("Hit your machine on port:", port);
        });
    });
};

app.start();
