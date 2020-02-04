const { succ, err, info, warn } = require('../utilities/constants');

module.exports = {
    respondWithSuccess: (res, responseMessage, data, responseCode, httpStatus=200) => {
        res.__body = {
            status: succ,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };
        console.log(data);
        res.status(httpStatus).json(res.__body);
    },

    respondWithError: (res, responseMessage, data, responseCode, httpStatus=200) => {
        res.__body = {
            status: err,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.status(httpStatus).json(res.__body);
    },

    respondWithInformation: (res, responseMessage, data, responseCode, httpStatus=200) => {
        res.__body = {
            status: info,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.status(httpStatus).json(res.__body);
    },

    respondWithWarning: (res, responseMessage, data, responseCode, httpStatus=200) => {
        res.__body = {
            status: warn,
            responseCode: `${responseCode}`,
            responseMessage: `${responseMessage}`,
            data: Array.isArray(data) ? data : data ? [data] : null
        };

        res.status(httpStatus).json(res.__body);
    },

    responderException: class responderException extends Error {  
        responseMessage = "";
        data = null; 
        responseCode = "211"; 
        httpStatus = 200;

        constructor (responseMessage, data, responseCode, httpStatus=200) {
            super(responseMessage);

            this.responseMessage = responseMessage;
            this.data = data;
            this.responseCode = responseCode;
            this.httpStatus = httpStatus;
            this.__body = {
                status: err,
                responseCode: `${responseCode}`,
                responseMessage: `${responseMessage}`,
                data: Array.isArray(data) ? data : data ? [data] : null
            };
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
