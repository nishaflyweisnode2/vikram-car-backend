const mongoose = require('mongoose');

const limitSchema = new mongoose.Schema({
    from: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for "from".'
        }
    },
    to: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for "to".'
        }
    },
    limit: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: '{VALUE} is not an integer value for "limit".'
        }
    }
});

const LimitModel = mongoose.model('LimitModel', limitSchema);

module.exports = LimitModel;
