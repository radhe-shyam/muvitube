const movie = require('./Movie');
const util = require('../../../utilities');

module.exports = (req, res) => {
    let validation = util.validateReq(req.body, [
        'name',
        'description',
        'createdAt',
        'addedBy'
    ]);

    if (validation) {
        return util.sendWrongInputError(res, validation);
    } else {
        if (!req.user.isAdmin)
            return util.sendWrongInputError(res, 'Only admin can add new movies.');
        req.body.addedBy = req.user._id;
        let newMovie = new movie(req.body);
        return newMovie.saveToDB()
            .then(newUserResult => {
                return util.sendData(res, 'Movie Added.');
            })
            .catch(err => util.catchTheCatch(res, err));
    }
};