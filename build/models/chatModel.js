"use strict";

var mongoose = require("mongoose");

var Schema = mongoose.Schema;
var ChatSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  }
});
var ChatModel = mongoose.model("chat", ChatSchema);
module.exports = ChatModel;
//# sourceMappingURL=chatModel.js.map