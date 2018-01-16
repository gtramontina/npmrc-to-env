module.exports = (map = {}) => object =>
  Object.entries(object).reduce(
    (res, [key, val]) => ({ ...res, [map[key] || key]: val }),
    {}
  );
