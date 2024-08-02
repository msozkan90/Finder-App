const genericErrorHandler = (err, req, res, next) => {
    let errorMessage = err.message;
    let errorStatus = res?.statusCode || 500;
    let errorCode = "ERROR";

    if (err) {
        errorStatus = err.status;
        errorCode = err.code;

        if (/\w+ validation failed  :  \w+/i.test(errorMessage)) {
            errorMessage = errorMessage.replace(/\w+ validation failed  :  \w+/i, "");
        }
    } else {
        console.log(err);
    }

    res.status(errorStatus).json({
        status: errorStatus,
        error: errorMessage,
        code: errorCode
    });
}

module.exports =  genericErrorHandler;