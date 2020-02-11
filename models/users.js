let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;
let newObjectId = mg.Types.ObjectId();
console.log("users generated ObjectId " + newObjectId + " isValid", mg.Types.ObjectId.isValid(newObjectId));

let usersSchema = new Schema({
    _id: {  
        type: ObjectId,
        default: newObjectId,
        index: true,
        required: false
    }, 
    username: {
        type: String,
        index: true,
        required: true
    }, 
    password: {
        type: String,
        required: true
    }, 
    passwordSalt: {
        type: String,
        required: true
    }, 
    createdOn: {
        type: String,
        index: true,
        required: true
    }, 
    updatedOn: {
        type: String,
        index: true,
        required: false
    }, 
    updatedBy: {
        type: ObjectId,
        index: true,
        required: false
    }, 
    lastLoginOn: {
        type: String,
        index: true,
        required: false
    }, 
    isDeleted: {
        type: Boolean,
        index: true,
        required: true
    }
});
usersSchema.set('versionKey', false);
mg.model("users",usersSchema); 

module.exports = {
    usersSchema: usersSchema,
    Schema: Schema,
    ObjectId: ObjectId,
    newObjectId: newObjectId
};