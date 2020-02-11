let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;
let newObjectId = mg.Types.ObjectId();
console.log("users generated ObjectId " + newObjectId + " isValid", mg.Types.ObjectId.isValid(newObjectId));

let bookingsSchema = new Schema({
    _id: {  
        type: ObjectId,
        default: newObjectId,
        index: true,
        required: false
    }, 
    seatId: {
        type: ObjectId,
        index: true,
        required: true
    }, 
    bookedByName: {
        type: String,
        index: true,
        required: true
    }, 
    bookedOn: {
        type: String,
        index: true,
        required: true
    }, 
    ticketCode: {
        type: String,
        index: true,
        required: true
    }, 
    isTicketCodeUsed: {
        type: Boolean,
        index: true,
        required: true
    }, 
    ticketCodeUsedOn: {
        type: String,
        index: true,
        required: false
    }
});
bookingsSchema.set('versionKey', false);
mg.model("bookings", bookingsSchema);

module.exports = {
    bookingsSchema: bookingsSchema,
    Schema: Schema,
    ObjectId: ObjectId,
    newObjectId: newObjectId
};