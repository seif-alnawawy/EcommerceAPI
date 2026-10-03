// const { Schema, model } = require("mongoose");
// const bcrypt = require("bcryptjs");

// const refreshTokenSchema = new Schema(
//   {
//     user: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     refreshToken: {
//       type: String,
//       required: true,
//     },
//   },
//   { timestamps: true, versionKey: false },
// );

// refreshTokenSchema.pre("save", async function () {
//   if (this.isModified("refreshToken")) {
//     this.refreshToken = await bcrypt.hash(this.refreshToken, 12);
//   }
// });

// module.exports = model("RefreshToken", refreshTokenSchema);
