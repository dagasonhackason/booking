let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;

let secretCodesSchema = new Schema({_id: ObjectId, secretCode: String, createdBy:ObjectId, createdOn:String, updatedBy:ObjectId, updatedOn:String, isDeleted:Boolean});
mg.model("secretCodes",secretCodesSchema);