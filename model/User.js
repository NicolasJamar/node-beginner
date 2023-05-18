const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  usertname: {
    type: String,
    require: true
  },
  roles: {
    User: {
      type: Number,
      default: 2001      
    },
    Editor: Number,
    Admin: Number
  },
  password: {
    typr: String,
    required: true
  },
  refreshToken: String
});

module.exports = mongoose.model('User', userSchema);