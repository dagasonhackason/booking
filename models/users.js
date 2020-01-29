let mg = require("mongoose");
let Schema = mg.Schema;

let usersSchema = new Schema({username:String, password:String, passwordSalt:String, createdOn:String, updatedOn:String, updatedBy:String, lastLoginOn:String, isDeleted:Boolean});
mg.model("users",usersSchema);