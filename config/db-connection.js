const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose
    // @ts-ignore
    .connect(process.env.DB_URI, {})
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("Error connecting to MongoDB:", err);
      process.exit(1);
    });
};

module.exports = dbConnection;
