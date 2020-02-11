let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;
let newObjectId = mg.Types.ObjectId();
console.log("users generated ObjectId " + newObjectId + " isValid", mg.Types.ObjectId.isValid(newObjectId));


let secretCodesSchema = new Schema({
    _id: {  
        type: ObjectId,
        default: newObjectId,
        index: true,
        required: false
    }, 
    secretCode: {
        type: String,
        index: true,
        required: true
    }, 
    createdBy: {
        type: ObjectId,
        index: true,
        required: true
    }, 
    createdOn: {
        type: String,
        index: true,
        required: true
    }, 
    updatedBy: {
        type: ObjectId,
        index: true,
        required: false
    }, 
    updatedOn: {
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
secretCodesSchema.set('versionKey', false);
mg.model("secretCodes",secretCodesSchema);

module.exports = {
    secretCodesSchema: secretCodesSchema,
    Schema: Schema,
    ObjectId: ObjectId,
    newObjectId: newObjectId
};