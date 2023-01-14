const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const NGOSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        max: 255,
    },
    description: {
        type: String,
        required: true,
        max: 255,
    },
    availability: {
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
});

NGOSchema.plugin(uniqueValidator); //mongoose unique validator
module.exports = mongoose.model("NGO", NGOSchema);
