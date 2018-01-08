const user = require('./apis/models/user/User');
const util = require('./utilities');
const mongodb = require('mongodb');
const pathPrefix = _ => `/api/${_}`;


module.exports = () => {

    let authentication = (req, res, next) => {
        var token = req.header('Authorization');
        if (util.isVoid(token)) {
            res.status(401).send("Not Authorized");
        } else {
            token = token.split(' ');
            if (util.isVoid(token[0]) || !mongodb.ObjectID.isValid(token[1])) {
                res.status(401).send("Not Authorized");
            } else {
                user.findOne({
                    _id: mongodb.ObjectID(token[1]),
                    authenticationKey: { $elemMatch: { code: token[0] } }
                })
                    .then((result) => {
                        if (!util.isVoid(result)) {
                            req.user = result;
                            next();
                        } else {
                            res.status(401).send("Not Authorized");
                        }
                    })
                    .catch((err) => {
                        util.catchTheCatch(res, err);
                    });
            }
        }
    }

    app.get(pathPrefix(''), require('./apis/check'));
    app.post(pathPrefix('user/save'), require('./apis/models/user/save'));
    app.post(pathPrefix('user/login'), require('./apis/models/user/login'));

    app.post(pathPrefix('movie/save'), authentication, require('./apis/models/movie/save'));
    app.post(pathPrefix('movie/delete'), authentication, require('./apis/models/movie/delete'));

};