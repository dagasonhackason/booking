const mg = require('mongoose');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const bookingsSchema = new Schema({
    seatId: {
        type: ObjectId,
        ref: 'Seats'
    }, 
    bookedByName: String, 
    bookedOn: String, 
    ticketCode: {
        type: String,
        unique: true
    }, 
    isTicketCodeUsed: Boolean, 
    ticketCodeUsedOn: String
});

bookingsSchema.set('versionKey', false);
module.exports = mg.model('Bookings', bookingsSchema);