const mongoose = require("mongoose");
require("dotenv").config();
const DB =`mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.sjxr9uv.mongodb.net/crtitq?retryWrites=true&w=majority`;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database connected!!!"))
  .catch((error) => {
    console.log(error);
  });