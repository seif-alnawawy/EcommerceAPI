const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const brandSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Brand name is required"],
      unique: true,
      maxLength: 32,
      lowercase: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      url: {
        type: String,
        default: null,
      },
      publicId: {
        type: String,
        default: null,
      },
    },
  },
  { timestamps: true, versionKey: false },
);

brandSchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

module.exports = model("Brand", brandSchema);
