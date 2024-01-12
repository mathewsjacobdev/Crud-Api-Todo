const mongoose = require("mongoose");

const todoSchema = mongoose.Schema(
  {
    list: {
      type: String,
      required: true,
    },
    image: {
      data: Buffer, // Binary data for the image
      contentType: String, // MIME type of the image
    },
  },
  {
    timestamps: true,
  }
);

const todoModel = mongoose.model("todoModel", todoSchema);

module.exports = todoModel;
