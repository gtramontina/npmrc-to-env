const TransformKeys = require("./transform-keys");

const If = condition => then => otherwise => (condition ? then : otherwise);
const ByKey = val => ([[_scope, key], _val]) => val === key;
const ByScope = val => ([[scope, _key], _val]) => val === scope;
const GetValue = ([_key, val] = ["", ""]) => val;
const Transform = (fn = x => x) => val => fn(val);
const FromBase64 = str => new Buffer(str, "base64").toString("ascii");
const IgnoreScope = ([[_scope, key], val]) => [key, val];
const SplitAtFirst = sep => str => str.replace(sep, "<1st>").split("<1st>");
const DefaultScope = def => ([scop, k]) => [If(k)(scop)(def), If(k)(k)(scop)];
const IgnoreProtocol = str => str.replace(/^https?:/, "");
const ToKeyValuePair = (obj, [key, val]) => ({ ...obj, [key]: val });
const TransformValues = map => ([key, val]) => [key, Transform(map[key])(val)];

// ---

const ROOT = "<root>";

exports.toEnv = require("./to-env");
exports.defaultKeysMap = require("./default-keys-map");

exports.parse = ({ input, scope = ROOT, keysMap }) => {
  const config = input
    .split("\n")
    .map(SplitAtFirst("="))
    .map(([key, val]) => [SplitAtFirst(":")(key), val])
    .map(([key, val]) => [DefaultScope(ROOT)(key), val]);

  const registry = IgnoreProtocol(
    GetValue(config.filter(ByScope(scope)).find(ByKey("registry")))
  );

  return TransformKeys(keysMap)(
    config
      .filter(ByScope(registry))
      .map(IgnoreScope)
      .map(TransformValues({ _password: FromBase64 }))
      .reduce(ToKeyValuePair, {})
  );
};
