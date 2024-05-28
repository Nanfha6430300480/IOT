const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  image: {
    data: Buffer,
    contentType: String
  },
  fileName: String,
  openTime: String,
  closeTime: String
});

const Photomodel = mongoose.model('Photo', photoSchema);

module.exports = Photomodel;