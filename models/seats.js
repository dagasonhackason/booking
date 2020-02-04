let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;

let seatsSchema = new Schema({_id: ObjectId, seatNumber:String, status:String, createdBy:ObjectId, createdOn:String, updatedBy:ObjectId, updatedOn:String, isActivated:Boolean, isDeleted:Boolean});
mg.model("seats", seatsSchema);