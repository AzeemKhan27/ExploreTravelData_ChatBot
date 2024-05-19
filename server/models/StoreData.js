const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreDataSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
   
    image: {
      type: String,
      required: false,
    },
    token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("StoreData", StoreDataSchema);
