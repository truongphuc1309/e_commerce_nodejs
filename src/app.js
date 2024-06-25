const express = require ('express')
const app = express()

const morgan = require('morgan')
const helmet = require ('helmet')
const compression = require('compression')
const {checkOverLoad} = require('./helpers/check.connect')

// init middelwares
app.use(morgan('dev'))
app.use(helmet())
app.use(compression())
app.use (express.json())
app.use (express.urlencoded({
    extended : true,
}))

// Check overload
//checkOverLoad()

// init db
require('./dbs/init.mongodb')

// init router
app.use('', require('./routes'))

// handle error
app.use((req, res, next) => {
    const error = new Error ('Not found') 
    error.status = 404 
    next(error)
})

app.use((err, req, res, next) => {
    const statusCode = err.status || 500
    console.log(err)
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: err.message || 'Internal Server Error',
    })
})

// Test
module.exports = app
