class ApiFeatures {
  constructor(query, mongooseQuery) {
    this.query = query;
    this.mongooseQuery = mongooseQuery;
    this.filterObj = {};
    this.pagination = {};
  }
  filter() {
    const queryObj = { ...this.query };
    const excludedFields = [
      "page",
      "sort",
      "limit",
      "fields",
      "search",
    ].forEach((field) => (queryObj[field] = undefined));

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    this.filterObj = {
      ...this.filterObj,
      ...JSON.parse(queryString),
    };

    // this.mongooseQuery.find(JSON.parse(queryString));
    return this;
  }

  search(fields = ["name", "description"]) {
    // const searchObj = {};

    if (!this.query.search) {
      return this;
    }
    this.filterObj.$or = fields.map((field) => ({
      [field]: {
        $regex: this.query.search,
        $options: "i",
      },
    }));

    // this.filterObj.$or = [
    //   { name: { $regex: this.query.search, $options: "i" } },
    //   { description: { $regex: this.query.search, $options: "i" } },
    // ];

    // this.filterObj = {
    //   ...this.filterObj,
    //   ...searchObj,
    // };

    // this.mongooseQuery.find(searchObj);
    return this;
  }

  applyFilters() {
    this.mongooseQuery.find(this.filterObj);
    return this;
  }

  sort() {
    if (this.query.sort) {
      this.mongooseQuery.sort(this.query.sort.split(",").join(" "));
    }
    return this;
  }

  select() {
    if (this.query.fields) {
      this.mongooseQuery.select(this.query.fields.split(",").join(" "));
    }
    this.mongooseQuery.select("-__v");
    return this;
  }

  paginate(totalItems) {
    const page = +this.query.page || 1;
    const limit = +this.query.limit || 10;
    const skip = (page - 1) * limit;

    this.pagination = {
      page,
      limit,
      pagesNumber: Math.ceil(totalItems / limit),
    };

    this.mongooseQuery.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiFeatures;
