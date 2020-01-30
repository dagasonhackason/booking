let mg = require("mongoose");
let Schema = mg.Schema;

let loginSessionsSchema = new Schema({userId:String, loggedInOn:String, loggedOutOn:String, loggedOutBy:String, expiresOn:String, sessionId:String, isExpired:Boolean});
mg.model("loginSessions", loginSessionsSchema);