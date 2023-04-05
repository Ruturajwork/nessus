const mongoose = require("mongoose");

const NessusModel = new mongoose.Schema({
  nesses: [
    {
      CVE: {
        type: String,
      },
      Risk: {
        type: String,
      },
      Host: {
        type: String,
      },
      Port: {
        type: Number,
      },
      Name: {
        type: String,
      },
      Synopsis: {
        type: String,
      },
    },
  ],
});

module.exports = mongoose.model("NessusModel", NessusModel);
