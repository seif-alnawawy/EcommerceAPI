const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      minLength: 3,
      maxLength: 32,
      trim: true,
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

categorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

module.exports = model("Category", categorySchema);
