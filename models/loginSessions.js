const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const loginSessionsSchema = new Schema({
    userId: ObjectId, 
    loggedInOn: String, 
    loggedOutOn: String, 
    loggedOutBy: ObjectId, 
    sessionId: String, 
    isExpired: Boolean, 
    expiresOn: String
});

loginSessionsSchema.set('versionKey', false);
module.exports = mg.model('LoginSessions', loginSessionsSchema);