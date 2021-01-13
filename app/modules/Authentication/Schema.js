
let Schema = require('mongoose').Schema;
let mongoose = require('mongoose');

let authtokensSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users' },
    token: { type: Buffer },
    tokenExpiryTime: { type: Date }
},
    { timestamps: true });

let Authtokens = mongoose.model('authtokens', authtokensSchema);

module.exports = {
    Authtokens: Authtokens,
}

