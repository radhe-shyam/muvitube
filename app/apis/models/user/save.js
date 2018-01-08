const user = require('./User');
const util = require('../../../utilities');

module.exports = (req, res) => {
    let validation = util.validateReq(req.body, [
        'name',
        'age',
        'username',
        'email',
        'password'
    ]);

    if (validation) {
        return util.sendWrongInputError(res, validation);
    } else {
        let newUser = new user(req.body);
        newUser.isAdmin = false;
        return newUser.saveToDB()
            .then(newUserResult => {
                return util.sendData(res, 'User created.');
            })
            .catch(err => util.catchTheCatch(res, err));
    }
};