// server/models/Footer.js
const mongoose = require('mongoose');

const footerSchema = mongoose.Schema(
    {
        section: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        title: {
            type: String,
            required: true,
            trim: true,
        },
        links: [
            {
                text: {
                    type: String,
                    required: true,
                    trim: true,
                },
                url: {
                    type: String,
                    default: '#',
                    trim: true,
                },
                icon: {
                    type: String,
                    default: '',
                },
            },
        ],
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Footer = mongoose.model('Footer', footerSchema);
module.exports = Footer;


