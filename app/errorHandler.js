let errorHandler = (err, req, res, next) => {
    console.log(err.message, err.stack);
    if (res.headersSent) {
        return next(err);
    }
    res.status(500).send('Something went wrong. Please have some patience until we resolve it');
}

module.exports = errorHandler;
