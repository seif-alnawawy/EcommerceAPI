const filterObject = (obj, allowedFields) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => allowedFields.includes(key)),
  );
};
module.exports = filterObject;
