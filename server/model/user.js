var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
      type : String,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: ['Activo', 'Inactivo']
    }
});

var user = mongoose.model('User', userSchema)

module.exports = user
