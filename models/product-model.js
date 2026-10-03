const { Schema, model } = require("mongoose");
const slugify = require("slugify");

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxLength: [100, "Too long product name"],
    },
    slug: {
      type: String,
      lowercase: true,
      required: [true, "slug is required"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minLength: [10, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],
    coverImage: {
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
    },
    gallery: {
      type: [
        {
          _id: false,
          url: String,
          publicId: String,
        },
      ],
      validate: {
        validator(value) {
          return value.length > 0;
        },
        message: "At least one gallery image is required",
      },
    },
    category: {
      type: Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a parent category"],
    },
    subCategories: [
      {
        type: Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: Schema.ObjectId,
      ref: "Brand",
    },
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true, versionKey: false },
);

productSchema.pre(/^find/, function () {
  this.populate("category", "name")
    .populate("brand", "name")
    .populate("subCategories", "name");
});
productSchema.pre("validate", function () {
  if (this.isModified("name")) {
    this.slug = slugify(this.name);
  }
});

module.exports = model("Product", productSchema);
