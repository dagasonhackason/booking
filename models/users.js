const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const usersSchema = new Schema({
    username: String, 
    password: String, 
    passwordSalt: String, 
    createdOn: String, 
    updatedOn: String, 
    updatedBy: ObjectId, 
    lastLoginOn: String, 
    isDeleted: Boolean
});

usersSchema.set('versionKey', false);
module.exports = mg.model('Users', usersSchema);