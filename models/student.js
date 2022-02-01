const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    roll: {
        type: String,
        unique: true,
        required: true
    },
    marks: {
        type: Number,
        require: true
    }
});

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;