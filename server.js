const express = require("express");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const dbConnection = require("./config/db-connection");
const ApiError = require("./utils/api-error");
const errorMiddleware = require("./middlewares/error-middleware");

// Connect to the database
dbConnection();

// Middlewares
const app = express();
app.set("query parser", "extended");
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Routes
app.use("/api/v1/categories", require("./routes/category-routes"));
app.use("/api/v1/subCategories", require("./routes/sub-category-routes"));
app.use("/api/v1/brands", require("./routes/brand-routes"));
app.use("/api/v1/products", require("./routes/product-routes"));
app.use("/api/v1/users", require("./routes/user-routes"));
app.use("/api/v1/auth", require("./routes/auth-routes"));

app.use((req, res, next) => {
  next(new ApiError(`Can't find ${req.originalUrl}`, 404));
});
app.use(errorMiddleware);

const server = app.listen(process.env.PORT || 8000);

// Handle rejections beyond express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name | err.message}`);
  server.close(() => {
    console.error("Shutting down...");
    process.exit(1);
  });
});
