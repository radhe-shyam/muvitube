const collectionName = 'users';

module.exports = class {
    constructor(userObject) {
        this.name = userObject.name;
        this.username = userObject.username;
        this.email = userObject.email;
        this.password = userObject.password;
        this.authenticationKey = userObject.authenticationKey;
        this.createdAt = userObject.createdAt;
        this.isAdmin = userObject.isAdmin;
        this.favoriteList = userObject.favoriteList;
        this.pendingList = userObject.pendingList;
        this.watchedList = userObject.watchedList;
    }

    saveToDB() {
        return this.constructor.findOne({ username: this.username }, { _id: 1 })
            .then(usernameResult => {
                if (usernameResult)
                    return Promise.reject('Username Already Exists.');
                return this.constructor.findOne({ email: this.email }, { _id: 1 });
            })
            .then(emailResult => {
                if (emailResult)
                    return Promise.reject('Email-id Already Exists.');
                this.authenticationKey = [];
                this.createdAt = new Date();
                this.pendingList = [];
                this.watchedList = [];
                this.favoriteList = [];
                return app.db.collection(collectionName).insert(this);
            })
            .then(newUser => {
                if (newUser && newUser.result && newUser.result.n)
                    return Promise.resolve('Created');
                return Promise.reject('Failed');
            })
    }

    static findOne(query, projection) {
        return app.db.collection(collectionName).findOne(query, projection);
    }

    static login(usernameOrEmail, password) {
        return this.findOne(
            {
                $and:
                    [
                        {
                            $or:
                                [
                                    { email: usernameOrEmail },
                                    { username: usernameOrEmail }
                                ]
                        },
                        { password: password }
                    ]
            },
            {
                authenticationKey: 0,
                password: 0,
                timestamp: 0
            });
    }
};