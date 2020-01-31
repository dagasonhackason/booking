const { succ, err, info, warn } = require('../utilities/constants');

module.exports = {
    respondWithSuccess: (res, responseMessage, data, responseCode, httpStatus=200) => {
        const body = {
            status: succ,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.__body = body;
        res.status(httpStatus).json(body);
    },

    respondWithError: (res, responseMessage, data, responseCode, httpStatus=200) => {
        const body = {
            status: err,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.__body = body;
        res.status(httpStatus).json(body);
    },

    respondWithInformation: (res, responseMessage, data, responseCode, httpStatus=200) => {
        const body = {
            status: info,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.__body = body;
        res.status(httpStatus).json(body);
    },

    respondWithWarning: (res, responseMessage, data, responseCode, httpStatus=200) => {
        const body = {
            status: warn,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.__body = body;
        res.status(httpStatus).json(body);
    },

    responderException: class responderException extends Error {  
        responseMessage = "";
        data = null; 
        responseCode = "201"; 
        httpStatus = 200;

        constructor (responseMessage, data, responseCode, httpStatus=200) {
            super(responseMessage);
            
            this.responseMessage = responseMessage;
            this.data = data;
            this.responseCode = responseCode;
            this.httpStatus = httpStatus;
        }

        setResponseMessage(arg) {
            this.responseMessage = arg;
            return this;
        }

        getResponseMessage() {
            return this.responseMessage;
        }

        setData(arg) {
            this.data = arg;
            return this;
        }

        getData() {
            return this.data;
        }

        setResponseCode(arg) {
            this.responseCode = arg;
            return this;
        }

        getResponseCode() {
            return this.responseCode;
        }

        setHttpStatus(arg) {
            this.httpStatus = arg;
            return this;
        }

        getHttpStatus() {
            return this.httpStatus;
        }
    }
} 
