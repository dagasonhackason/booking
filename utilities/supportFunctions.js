require('dotenv').config();
const CryptoJS = require("crypto-pbkdf2"); 
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const { connect } = require('monogram');
const assert = require('assert');
const DEFAULT_HASH_ITERATIONS = 4000;
const SALT_SIZE = 192/8;
const KEY_SIZE = 768/32;
const SECRET_KEY = process.env.JWT_SECRET;
const MONGODB_CONNECTION_STRING = process.env.MONGODB_CONNECTION_STRING;

const updateSeatsCollection = async (filterQuery, updatePayload) => {
    let dbMonogram = await connect(MONGODB_CONNECTION_STRING);
    let seatsCollection = dbMonogram.collection('seats');

    // console.log("new db connection monogram", dbMonogram);
    // console.log("new seat collection monogram", seatsCollection);

    let threw = false;

    try {

        let updatedSeats = await seatsCollection.updateOne(filterQuery, { updatePayload});
            // .then((response)=>{
            //     console.log("response seatsCollection updated", response)
            // });
        console.log("Seats Updated Monogram", updatedSeats);
        return (null, updatedSeats);
    } catch (error) {
        threw = true;
        console.error("Monogram Update Function", error);
        assert.equal(error.message, 'Not allowed to overwrite document ' +
            'using `updateOne()`, use `replaceOne() instead`');
        return (null, null);
    }

    // assert.ok(threw);
};

const generateTicket = function generateTicket() {
    let uuidPassed = "xyxyxyxy";
    
    return (uuidPassed).replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
};

const jwtSignTokenizer = function jwtSignTokenizer(payload, expiresIn='336h') {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
};

const jwtVerifyToken = function jwtVerifyToken(token) {
    let retVal = null;
    jwt.verify(token, SECRET_KEY, function(err, decoded) {
        if(err) {
            console.log("jwtVerifyToken() couldn't decode token " + token + " with error ::: ", err);
        } else if(decoded) {
            retVal = decoded;
        }
    });
    return retVal;
};

const meetsPasswordPolicyMax = function meetsPasswordPolicyMax(arg) {
    if(arg.length <= 30)
        return true;
    else
        return false;
};

const meetsPasswordPolicyMin = function meetsPasswordPolicyMin(arg) {
    if(arg.length >= 10)
        return true;
    else
        return false;
};

const dbStringSanitizer = function dbStringSanitizer(arg) {
    return arg.replace(/\\/g, "\\\\")
            .replace(/\$/g, "\\$")
            .replace(/'/g, "\\'")
            .replace(/"/g, "\\\"");
};

const getRandomInt = function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return parseInt(Math.floor(Math.random() * (max - min + 1)) + min);
};

const hashPassword = function hashPassword(value, salt){
    var i = salt.indexOf(".");
    var iters = parseInt(salt.substring(0, i), 16);
    var key = CryptoJS.PBKDF2(value, salt, { "keySize": KEY_SIZE, "iterations": iters });

    return key.toString(CryptoJS.enc.Base64);
};

const checkPassword = function checkPassword(candidate, salt, hashed){
    return hashPassword( candidate, salt ) === hashed;
};

const generateSalt = function generateSalt(explicitIterations){
    var defaultHashIterations = DEFAULT_HASH_ITERATIONS;

    if(explicitIterations !== null && explicitIterations !== undefined){
        if( parseInt(explicitIterations, 10) === explicitIterations ){
            throw new Error("explicitIterations must be an integer");
        }
        
        if( explicitIterations < DEFAULT_HASH_ITERATIONS){
            throw new Error("explicitIterations cannot be less than " + DEFAULT_HASH_ITERATIONS);
        }
    }

    var bytes = CryptoJS.lib.WordArray.random(SALT_SIZE);

    var iterations = (explicitIterations || defaultHashIterations).toString(16);

    return iterations + "." + bytes.toString(CryptoJS.enc.Base64);
};

exports.generateTicket = generateTicket;
exports.jwtSignTokenizer = jwtSignTokenizer;
exports.jwtVerifyToken = jwtVerifyToken;
exports.meetsPasswordPolicyMax = meetsPasswordPolicyMax;
exports.meetsPasswordPolicyMin = meetsPasswordPolicyMin;
exports.dbStringSanitizer = dbStringSanitizer;
exports.getRandomInt = getRandomInt;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.generateSalt = generateSalt;
exports.updateSeatsCollection = updateSeatsCollection;
