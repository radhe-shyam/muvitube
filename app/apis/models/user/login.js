const user = require('./User');
const util = require('../../../utilities');
module.exports = (req, res) => {

    let validation = util.validateReq(req.body, [
        'username',
        'password'
    ]);
    if (validation) {
        util.sendWrongInputError(res, validation);
    } else {
        let userData;
        user.login(req.body.username, req.body.password)
            .then((result) => {
                if (!result) {
                    return Promise.reject('Wrong Username/Password');
                }
                let token = require('crypto').randomBytes(48).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/\=/g, '');
                userData = result;
                userData.token = token;
                return user.update(
                    {
                        $or:
                            [
                                { email: req.body.username },
                                { username: req.body.username }
                            ]
                    }, {
                        $push: {
                            authenticationKey: {
                                $each: [{ code: token, createdAd: new Date() }],
                                $slice: -1
                            }
                        }
                    });
            })
            .then(() => {
                util.sendData(res, userData);
            })
            .catch(err => util.catchTheCatch(res, err));
    }

};