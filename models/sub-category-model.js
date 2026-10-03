const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const subCategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Sub category name is required"],
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
    category: {
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "Sub category must belong to a parent category"],
    },
  },
  { timestamps: true, versionKey: false },
);

subCategorySchema.pre("save", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

module.exports = model("SubCategory", subCategorySchema);
