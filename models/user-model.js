const { Schema, model } = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "User name is required"],
      minlength: 3,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 8,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      unique: true,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    profileImage: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },
    passwordReset: {
      hashedCode: { type: String, select: false },
      expiresAt: { type: Date, select: false },
      verified: { type: Boolean, select: false },
    },
    passwordChangedAt: Date,
    refreshToken: String,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

userSchema.set("toJSON", {
  transform(doc, ret) {
    delete ret.password;
    delete ret.refreshToken;
    return ret;
  },
});

userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordChangedAt = Date.now();
  }
});

module.exports = model("User", userSchema);
