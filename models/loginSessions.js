let mg = require("mongoose");
let Schema = mg.Schema, ObjectId = Schema.ObjectId;

let loginSessionsSchema = new Schema({_id: ObjectId, userId:String, loggedInOn:String, loggedOutOn:String, loggedOutBy:ObjectId, expiresOn:String, sessionId:String, isExpired:Boolean, expiresOn:String});
mg.model("loginSessions", loginSessionsSchema);