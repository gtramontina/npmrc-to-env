module.exports = object =>
  Object.entries(object)
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
