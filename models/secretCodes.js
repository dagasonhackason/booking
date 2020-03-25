const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const secretCodesSchema = new Schema({
    secretCode: {
        type: String,
        unique: true
    }, 
    createdBy: {
        type: ObjectId,
        ref: 'Users'
    }, 
    createdOn: String, 
    updatedBy: {
        type: ObjectId,
        ref: 'Users'
    }, 
    updatedOn: String, 
    isDeleted: Boolean
});

secretCodesSchema.set('versionKey', false);
module.exports = mg.model('SecretCodes', secretCodesSchema);