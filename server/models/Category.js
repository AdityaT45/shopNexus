const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
    {
        categoryId: {
            type: String,
            unique: true,
            sparse: true
        },
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },
        image: {
            type: String,
            required: true
        },
        subcategories: [{
            name: {
                type: String,
                required: true,
                trim: true
            }
        }],
        isActive: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
);

// Generate custom categoryId before saving
categorySchema.pre('save', async function(next) {
    if (!this.categoryId) {
        const timestamp = Date.now().toString().slice(-8);
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        this.categoryId = `CAT${timestamp}${random}`;
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;

