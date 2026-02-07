const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
    sessionId: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true
    },
    taste: {
        type: String,
        required: true
    },
    methods: {
        type: String,
        required: true
    },
    temp: {
        type: String,
        required: true
    },
    recommendedMenu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu',
        default: null
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Session', sessionSchema);
