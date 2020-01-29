let mg = require("mongoose");
let Schema = mg.Schema;

let secretCodesSchema = new Schema({secretCode: String, createdBy:String, createdOn:String, updatedBy:String, updatedOn:String, isDeleted:Boolean});
mg.model("secretCodes",secretCodesSchema);