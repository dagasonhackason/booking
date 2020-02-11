let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;
let newObjectId = mg.Types.ObjectId();
console.log("users generated ObjectId " + newObjectId + " isValid", mg.Types.ObjectId.isValid(newObjectId));


let loginSessionsSchema = new Schema({
    _id: {  
        type: ObjectId,
        default: newObjectId,
        index: true,
        required: false
    }, 
    userId: {
        type: ObjectId,
        index: true,
        required: true
    }, 
    loggedInOn: {
        type: String,
        index: true,
        required: true
    }, 
    loggedOutOn: {
        type: String,
        index: true,
        required: false
    }, 
    loggedOutBy: {
        type: ObjectId,
        index: true,
        required: false
    }, 
    sessionId: {
        type: String,
        index: true,
        required: true
    }, 
    isExpired: {
        type: Boolean,
        index: true,
        required: true
    }, 
    expiresOn: {
        type: Boolean,
        index: true,
        required: true
    }
});
loginSessionsSchema.set('versionKey', false);
mg.model("loginSessions", loginSessionsSchema);

module.exports = {
    loginSessionsSchema: loginSessionsSchema,
    Schema: Schema,
    ObjectId: ObjectId,
    newObjectId: newObjectId
};