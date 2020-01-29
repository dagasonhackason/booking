let mg = require("mongoose");
let Schema = mg.Schema;

let seatsSchema = new Schema({seatNumber:String, status:String, createdBy:String, createdOn:String, updatedBy:String, updatedOn:String, isActivated:Boolean, isDeleted:Boolean});
mg.model("seats",seatsSchema);