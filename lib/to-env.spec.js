const toEnv = require("./to-env");

describe("to-env", () => {
  it("converts a POJO into env format", () => {
    expect(toEnv({ a: 1 })).toEqual("a=1");
    expect(toEnv({ a: 1, b: 2 })).toEqual("a=1\nb=2");
    expect(toEnv({ a: 1, b: 2, KEY: "VALUE" })).toEqual("a=1\nb=2\nKEY=VALUE");
  });
});
