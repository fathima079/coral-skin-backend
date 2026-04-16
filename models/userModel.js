const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
         required: true},

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String, 
        required: true
    },

    role:{
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    accessToken: String,
    refreshToken: String,
    resetPasswordToken: String,
    resetPasswordExpiry: Date

}, { timestamps: true });

userSchema.pre("save", async function (){
    if(!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
    // next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};


module.exports = mongoose.model("User", userSchema);