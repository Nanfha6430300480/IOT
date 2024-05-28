const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const envSchema = new Schema({
  temperature: String,
  humidity: String,
  ph: String,
  ec: String,
  time:String,
  n:String,
  p:String,
  k:String,
  
});

const EnvModel = mongoose.model('current_envs', envSchema);

module.exports = EnvModel;