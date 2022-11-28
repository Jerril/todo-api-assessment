const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, trim: true, minlength: 6 }
})

module.exports = mongoose.model('User', UserSchema);