'use strict'

const {StatusCodes, ReasonPhrases} = require ('../utils/httpStatusCode')

class SuccessResponse {
    constructor ({message = ReasonPhrases.OK, statusCode = StatusCodes.OK, metadata = {}}){
        this.message = message
        this.status = statusCode
        this.metadata = metadata
    }
    
    send (res, headers = {}){
        return res.status(this.status).json(this)
    }
}


class CreatedResponse extends SuccessResponse {
    constructor ({message = ReasonPhrases.CREATED, statusCode = StatusCodes.CREATED, metadata = {}}){
        super({message, statusCode, metadata})
    }
}

module.exports = {
    SuccessResponse,
    CreatedResponse,
}
