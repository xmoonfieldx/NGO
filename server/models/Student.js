const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
    },
    usn: {
        type: String,
        required: true,
        max: 10,
    },
    admn_num: {
        type: String,
        required: true,
        max: 10,
    },
    email: {
        type: String,
        required: true,
        min: 6,
        max: 255,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

studentSchema.plugin(uniqueValidator); //mongoose unique validator
module.exports = mongoose.model("Student", studentSchema);
