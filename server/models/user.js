const mongoose =  require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdDate: { 
        type: Date, 
        default: Date.now 
    }
});

UserSchema.set('toJSON', { 
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

UserSchema.set('toObject', { 
    transform: function (doc, ret, options) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
    },
    virtuals: true
});

UserSchema.plugin(mongoosePaginate);

module.exports = User = mongoose.model('user', UserSchema);