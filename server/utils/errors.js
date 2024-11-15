import ResponseError from "./respErr.js"

const handleErrors = (err, req, res, next) => {
    const { status = 500, message = "Internal server error" } = err
    if (process.env.NODE_ENV == 'development') {
        res.status(status).json({
            err: err,
            message,
            stack: err.stack
        })
    } else {
        let error = { ...err }
        error.message = message
        if (err.name == 'CastError') {
            const message = `Recource not found. Invalid: ${err.path}`
            error = new ResponseError(
                message,
                400
            )
        } else if (err.name == 'ValidationError') {
            const message = Object.values(err.errors).map(value => value.message)
            error = new ResponseError(
                message,
                400
            )
        } else if (err.code === 11000) {
            const duplicatedKey =  Object.keys(err.keyPattern)[0];
            const message = `${duplicatedKey} is already in use`
            error = new ResponseError(
                message,
                409
            )
        } else if (err.name === 'JsonWebTokenError') {
            const message = 'Invalid token'
            error = new ResponseError(
                message,
                401
            )
        } else if (err.name === 'SyntaxError') {
            error = new ResponseError(
                err.message,
                401
            )
        }
        res.status(status).json({
            message: error.message
        })
    }
}

export default handleErrors