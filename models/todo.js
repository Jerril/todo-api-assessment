const mongoose = require('mongoose');
const { Schema } = mongoose;

const TodoSchema = new Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Todo', TodoSchema);