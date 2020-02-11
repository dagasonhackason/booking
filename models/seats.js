let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;
let newObjectId = mg.Types.ObjectId();
console.log("users generated ObjectId " + newObjectId + " isValid", mg.Types.ObjectId.isValid(newObjectId));


let seatsSchema = new Schema({
    _id: {  
        type: ObjectId,
        default: mg.Types.ObjectId(),
        index: true,
        required: false
    }, 
    seatNumber: {
        type: String,
        index: true,
        required: true
    }, 
    status: {
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
    isActivated: {
        type: Boolean,
        index: true,
        required: true
    }, 
    isDeleted: {
        type: Boolean,
        index: true,
        required: true
    }
});
seatsSchema.set('versionKey', false);
mg.model("seats", seatsSchema);

module.exports = {
    seatsSchema: seatsSchema,
    Schema: Schema,
    ObjectId: ObjectId,
    newObjectId: newObjectId
};