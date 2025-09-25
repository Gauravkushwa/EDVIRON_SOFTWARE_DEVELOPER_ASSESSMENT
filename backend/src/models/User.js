const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username : {type: String, required: true},
    email : {type: String, required: true, unique: true},
    password : {type: String, required: true, minlength: 6},
    schoolId: { type: mongoose.Schema.Types.ObjectId, ref: 'School' }, 
    role : {type:String, enum: ["admin", "finance", "school_staff", "user"], default: "user"},
    createdAt : {type: Date, default: Date.now}
}, {
    versionKey: false,
    timestamps: true
});

const UserModel = mongoose.model("User", userSchema);

module.exports = {UserModel};