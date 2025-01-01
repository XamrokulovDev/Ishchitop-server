const mongose = require("mongoose");
const User = require("./user.model");

const adsSchema = new mongose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: [String],
        required: true,
    },
    category: {
        type: [String],
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        default: false,
    },
    user: {
        type: mongose.Schema.Types.ObjectId,
        ref: "User",
    },
},{
    timestamps: true,
});

module.exports = mongose.model("Ads", adsSchema);