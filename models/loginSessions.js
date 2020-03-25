const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const loginSessionsSchema = new Schema({
    userId: {
        type: ObjectId,
        ref: 'Users'
    }, 
    loggedInOn: String, 
    loggedOutOn: String, 
    loggedOutBy: {
        type: ObjectId,
        ref: 'Users'
    }, 
    sessionId: {
        type: String,
        unique: true
    }, 
    isExpired: Boolean, 
    expiresOn: String
});

loginSessionsSchema.set('versionKey', false);
module.exports = mg.model('LoginSessions', loginSessionsSchema);