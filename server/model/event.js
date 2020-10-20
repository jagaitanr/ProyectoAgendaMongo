var mongoose = require('mongoose');

var eventCalendarSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date,
        default: Date.now
    },
    startHour:{
      type: String
    },
    endHour:{
      type: String
    }
});

var EventCalendar = mongoose.model('Event', eventCalendarSchema);

module.exports = EventCalendar;
