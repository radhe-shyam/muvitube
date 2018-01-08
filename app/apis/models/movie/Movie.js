const mongodb = require('mongodb');
const user = require('../user/User');
const collectionName = 'movies';

module.exports = class {
    constructor(movieObject) {
        this._id = movieObject._id;
        this.name = movieObject.name;
        this.description = movieObject.description;
        this.createdAt = movieObject.createdAt;
        this.addedBy = movieObject.addedBy;
    }

    static findOne(query, projection) {
        return app.db.collection(collectionName).findOne(query, projection);
    }

    static findMultiple(query, projection) {
        return app.db.collection(collectionName).find(query, projection).toArray();
    }


    static update(query, update) {
        return app.db.collection(collectionName).update(query, update);
    }

    delete() {
        return app.db.collection(collectionName).remove({ _id: this._id });
    }

    saveToDB() {
        return app.db.collection(collectionName).insert(this);
    }

    static findWithUserDetails(query) {
        return app.db.collection(collectionName).aggregate(query);
    }

};