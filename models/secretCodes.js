const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const secretCodesSchema = new Schema({
    secretCode: String, 
    createdBy: ObjectId, 
    createdOn: String, 
    updatedBy: ObjectId, 
    updatedOn: String, 
    isDeleted: Boolean
});

secretCodesSchema.set('versionKey', false);
module.exports = mg.model('SecretCodes', secretCodesSchema);