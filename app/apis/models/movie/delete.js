import { Module } from 'module';

const user = require('./User');
const Movie = require('./Movie');
const mongodb = require('mongodb');
const util = require('../../../utilities');
module.exports = (req, res) => {

    let validation = util.validateReq(req.body, [
        '_id'
    ]);
    if (validation)
        return util.sendWrongInputError(res, validation);
        
    if (!req.user.isAdmin)
        return util.sendWrongInputError(res, 'Only admin can delete movies.');

    return Movie.findOne({ _id: mongodb.ObjectId(req.body._id) })
        .then(movieDetails => {
            if (movieDetails) {
                movieDetails = new Movie(movieDetails);
                return movieDetails.delete();
            }
            return util.sendWrongInputError(res, 'Movie not available')
        })
        .then(() => {
            util.sendData(res, userData);
        })
        .catch(err => util.catchTheCatch(res, err));

};