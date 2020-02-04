let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;

let bookingsSchema = new Schema({_id: ObjectId, seatId:String, bookedByName:String, bookedOn:String, ticketCode:String, isTicketCodeUsed:Boolean, ticketCodeUsedOn:String});
mg.model("bookings", bookingsSchema);