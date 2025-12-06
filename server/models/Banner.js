const mongoose = require('mongoose');

const bannerSchema = mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,   // File Manager image URL
            required: true,
        },
        status: {
            type: String,
            enum: ["Active", "Inactive"],
            default: "Active",
        },
        link: {
            type: String,   // optional: where banner should redirect
            default: "",
        }
    },
    { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);

module.exports = Banner;
