const mg = require('mongoose');
const Users = require('../models/users');
const Schema = mg.Schema, ObjectId = Schema.ObjectId;

const seatsSchema = new Schema({
    seatNumber: {
        type: String,
        unique: true
    }, 
    status: Boolean, 
    createdBy: {
        type: ObjectId,
        ref: 'Users'
    }, 
    createdOn: String, 
    updatedBy: {
        type: ObjectId,
        ref: 'Users'
    }, 
    updatedOn: String, 
    isActivated: Boolean, 
    isDeleted: Boolean
});

seatsSchema.set('versionKey', false);
module.exports = mg.model('Seats', seatsSchema);