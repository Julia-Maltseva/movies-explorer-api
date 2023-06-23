const mongoose = require('mongoose');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email);
      },
      message: 'Поле должно быть валидным email-адресом',
    },
  },
  password: {
    required: true,
    type: String,
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
