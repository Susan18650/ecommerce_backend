const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const columnSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  tasks: [{
    type: Schema.Types.ObjectId,
    ref: "Task"
  }],
  position: {
    type: Number
  },
}, schemaOptions);


module.exports = mongoose.model('Column', columnSchema);
