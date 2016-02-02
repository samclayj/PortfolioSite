'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WakatimeSchema = new Schema({
  language_name: String,
  hidden: Boolean,
  dateTimes : [{
    date : { type: Date, default: Date.now },
    time : Number
  }]

});

module.exports = mongoose.model('Wakatime', WakatimeSchema);
