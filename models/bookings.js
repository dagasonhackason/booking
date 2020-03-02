const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const bookingsSchema = new Schema({
    seatId: ObjectId, 
    bookedByName: String, 
    bookedOn: String, 
    ticketCode: String, 
    isTicketCodeUsed: Boolean, 
    ticketCodeUsedOn: String
});

bookingsSchema.set('versionKey', false);
module.exports = mg.model('Bookings', bookingsSchema);