let mg = require("mongoose");
let Schema = mg.Schema;

let loginSessionsSchema = new Schema({userId:String, loggedInOn:String, loggedOutOn:String, loggedOutBy:String, sessionId:String});
mg.model("loginSessions", loginSessionsSchema);