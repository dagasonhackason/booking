let mg = require("mongoose");
let Schema = mg.Schema;

let bookingsSchema = new Schema({seatId:String, bookedByName:String, bookedOn:String, ticketCode:String, isTicketCodeUsed:Boolean, ticketCodeUsedOn:String});
mg.model("bookings",bookingsSchema);