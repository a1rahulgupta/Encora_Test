const mongoose = require('mongoose');
const schema = mongoose.Schema;

const noteSchema = new mongoose.Schema({
    userId: { type: schema.Types.ObjectId, ref: 'Users' },
    title: { type: String },
    description: { type: String },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true
});

const Notes = mongoose.model('notes', noteSchema);
module.exports = {
    Notes
}