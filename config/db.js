const config = require("config");
const db = config.get("mongoURI");
const mongoose = require("mongoose");

const connectDB = async () => {
  const conn = await mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  console.log(`database connected: ${conn.connection.host}`);
};

module.exports = connectDB;
