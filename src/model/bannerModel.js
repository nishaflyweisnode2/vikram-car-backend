const mongoose = require("mongoose");
const schema = mongoose.Schema;
const bannerSchema = mongoose.Schema({

    image: {
        type: String,
        require: true,
    },
    title: {
        type: String,
        require: true,
    },
    desc: {
        type: String,
        require: false,
    },
}, { timestamps: true });
const banner = mongoose.model("banner", bannerSchema);

module.exports = banner;
