let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;

let usersSchema = new Schema({_id: ObjectId, username:String, password:String, passwordSalt:String, createdOn:String, updatedOn:String, updatedBy:ObjectId, lastLoginOn:String, isDeleted:Boolean});
mg.model("users",usersSchema);