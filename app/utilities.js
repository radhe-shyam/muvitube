let isVoid = (obj) => {
    switch (typeof (obj)) {
        case "undefined":
        case "object":
            for (let x in obj) {
                if (obj.hasOwnProperty(x))
                    return false;
                else
                    return true;
            }
            return true;
        case "number":
        case "boolean":
            return false;
        case "string":
            if (obj === "")
                return true;
            else
                return false;
        /* falls through */
        default:
            return false;
    }
};


let getErrorJSON = (err) => {
    if (!err) err = {};
    let toRet = {};
    for (let key in err) {
        if (err.hasOwnProperty(key))
            toRet[key] = err[key];
    }
    toRet.message = err.message;

    toRet.stack = err.stack;
    return toRet;
};

let sendData = (res, data) => {
    let dataToReturn = {
        status: true
    };
    if (data) {
        dataToReturn.data = data;
    }
    res.status(200).json(dataToReturn);
};

let sendWrongInputError = (res, message, options) => {
    res.status(400).json({
        status: false,
        message: message
    });
};

let catchTheCatch = (res, err) => {
    if (typeof err === 'string')
        sendWrongInputError(res, err);
    else
        sendError(res, null, err);
}

let sendError = (res, statusCode, err, statusMessage) => {
    if (!err) err = {};
    let statusCodeToSend = statusCode || err.statusCode || 500;
    statusMessage = statusMessage || 'ERROR';
    res.status(statusCodeToSend).json({
        status: statusMessage,
        error: getErrorJSON(err)
    });
};


let getParams = (args, query) => {
    let missing;
    missing = args.list.filter((arg) => {
        return query[arg] === undefined;
    });

    let fields = [];
    fields = args.list.filter((arg) => {
        return missing.indexOf(arg) == -1;
    });

    let paramsObject = {};
    paramsObject.list = args.list;

    if (missing.length > 0)
        paramsObject.missing = missing;

    fields.forEach((arg) => {
        paramsObject[arg] = query[arg];
    });

    return paramsObject;
}

let validateReq = (source, mandatoryKeys) => {
    let missingKeys = [];
    mandatoryKeys.forEach((value) => {
        if (isVoid(source[value])) {
            missingKeys.push(value);
        }
    });
    if (missingKeys.length) {
        return 'Missing fields: ' + missingKeys.toString();
    } else {
        return;
    }

}

module.exports.isVoid = isVoid;
module.exports.sendData = sendData;
module.exports.sendError = sendError;
module.exports.getErrorJSON = getErrorJSON;
module.exports.sendWrongInputError = sendWrongInputError;
module.exports.getParams = getParams;
module.exports.validateReq = validateReq;
module.exports.catchTheCatch = catchTheCatch;