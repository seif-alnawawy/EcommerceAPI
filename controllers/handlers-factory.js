const fs = require("fs");

const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");

const ApiError = require("../utils/api-error");
const ApiFeatures = require("../utils/api-features");

exports.getDocuments = (Model) =>
  asyncHandler(async (req, res) => {
    // Apply api features
    const apiFeatures = new ApiFeatures(req.query, Model.find(req.params))
      .filter()
      .search()
      .applyFilters();
    const totalItems = await Model.countDocuments({
      ...req.params,
      ...apiFeatures.filterObj,
    });

    apiFeatures.paginate(totalItems).sort().select();

    // return the response
    const documents = await apiFeatures.mongooseQuery;
    res.status(200).json({
      data: documents,
      totalItems,
      pagination: apiFeatures.pagination,
    });
  });

exports.getDocumentById = (Model) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError(`${Model.modelName} not found`, 404));
    }

    return res.status(200).json({
      data: document,
    });
  });

exports.createDocument = (Model, beforeCreate) =>
  asyncHandler(async (req, res) => {
    if (beforeCreate) {
      await beforeCreate(req);
    }

    const document = await Model.create(req.body);
    res.status(201).json({
      message: `${Model.modelName} created successfully.`,
      data: document,
    });
  });

exports.updateDocument = (Model, beforeSave) =>
  asyncHandler(async (req, res, next) => {
    const document = await Model.findById(req.params.id);
    if (!document) {
      return next(new ApiError(`${Model.modelName} not found`, 404));
    }

    if (beforeSave) {
      await beforeSave(document, req);
    }

    document.set(req.body);
    await document.save();

    return res.status(200).json({
      message: `${Model.modelName} updated successfully`,
      data: document,
    });
  });

exports.deleteDocument = (Model, afterDelete) =>
  asyncHandler(async (req, res, next) => {
    const deletedDocument = await Model.findByIdAndDelete(req.params.id);
    if (!deletedDocument) {
      return next(new ApiError(`${Model.modelName} not found`, 404));
    }

    if (afterDelete) {
      await afterDelete(deletedDocument);
    }

    return res.status(200).json({
      message: `${Model.modelName} deleted successfully`,
    });
  });
