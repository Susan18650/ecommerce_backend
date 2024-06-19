const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { schemaOptions } = require('./modelOptions');

const taskSchema = new Schema({
  columnId: {
    type: Schema.Types.ObjectId,
    ref: 'Column',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  position: {
    type: Number,
  }
}, schemaOptions);


module.exports = mongoose.model('Task', taskSchema);
