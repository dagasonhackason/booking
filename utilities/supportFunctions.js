require('dotenv').config();
const CryptoJS = require("crypto-PBKDF2"); 
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const DEFAULT_HASH_ITERATIONS = 4000;
const SALT_SIZE = 192/8;
const KEY_SIZE = 768/32;
const SECRET_KEY = process.env.JWT_SECRET;

const generateTicket = function generateTicket() {
    let uuidPassed = uuid();
    
    return ('xyx-9x-x30y-' + uuidPassed + 'yx5x').replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
}

const jwtSignTokenizer = function jwtSignTokenizer(payload, expiresIn='336h') {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: expiresIn });
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
}

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
exports.meetsPasswordPolicyMax = meetsPasswordPolicyMax;
exports.meetsPasswordPolicyMin = meetsPasswordPolicyMin;
exports.dbStringSanitizer = dbStringSanitizer;
exports.getRandomInt = getRandomInt;
exports.hashPassword = hashPassword;
exports.checkPassword = checkPassword;
exports.generateSalt = generateSalt;