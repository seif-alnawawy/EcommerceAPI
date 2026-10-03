const multer = require("multer");

const ApiError = require("../utils/api-error");

const storage = multer.memoryStorage();

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new ApiError("Only Images allowed", 400), false);
  }
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

exports.uploadSingleFile = (fieldName) => upload.single(fieldName);

exports.uploadMixOfImages = (arrayOfFields) => upload.fields(arrayOfFields);
