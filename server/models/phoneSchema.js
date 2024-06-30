const mongoose = require("mongoose");

const phoneSchema = new mongoose.Schema(
  {
    phone: { type: String },
    id: { type: Number },
    sid: { type: Number },
    verified: { type: Boolean },
  },
  { timestamps: true }
);

module.exports = mongoose.model("phone", phoneSchema);
