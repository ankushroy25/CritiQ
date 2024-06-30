const mongoose = require("mongoose"); 
 
const customerSchema = new mongoose.Schema( 
  { 
    name: {type:String,},
    email: { type: String, required: true, unique: true },
    walletAddress: { type: String, required: true, unique: true },
    type:{
      type:String,
      default:"user",
      required:true},
    pkey:{type:String,},
    skey:{type:String,},
  }, 
  { timestamps: true } 
); 
 
module.exports = mongoose.model("customer", customerSchema);
