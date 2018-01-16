const dedent = require("dedent");
const { parse } = require(".");

describe("parse", () => {
  it("parses nothing if there is nothing", () => {
    const input = ``;
    expect(parse({ input })).toEqual({});
  });

  it("understands an HTTP registry", () => {
    const input = dedent`
      @scope-http:registry=https://scope-http
      //scope-http:username=scope-http-username
    `;
    expect(parse({ input, scope: "@scope-http" })).toEqual({
      username: "scope-http-username"
    });
  });

  it("understands an HTTPS registry", () => {
    const input = dedent`
      @scope-https:registry=https://scope-https
      //scope-https:username=scope-https-username
    `;
    expect(parse({ input, scope: "@scope-https" })).toEqual({
      username: "scope-https-username"
    });
  });

  it("parses all properties of the given scope", () => {
    const input = dedent`
      @scope-all:registry=https://scope-all
      //scope-all:a=1
      //scope-all:b=2
      //scope-all:c=3
      //scope-all:d=4
      //scope-all:e=5
    `;
    expect(parse({ input, scope: "@scope-all" })).toEqual({
      a: "1",
      b: "2",
      c: "3",
      d: "4",
      e: "5"
    });
  });

  it("parses the public registry's properties if no scope is provided", () => {
    const input = dedent`
      registry=https://public.registry
      //public.registry:_authToken=public.registry-authToken
    `;
    expect(parse({ input })).toEqual({
      _authToken: "public.registry-authToken"
    });
  });

  it("decodes _password if present", () => {
    const _password = "scope-s3cr37-p4ssw0rd";
    const encodedPassword = new Buffer(_password).toString("base64");
    const input = dedent`
      @scope-https:registry=https://scope-https
      //scope-https:_password=${encodedPassword}
    `;
    expect(parse({ input, scope: "@scope-https" })).toEqual({ _password });
  });

  it("ignores comments", () => {
    const input = dedent`
      @scope:registry=https://scope
      ; //scope:a=1
      # //scope:b=2
    `;
    expect(parse({ input, scope: "@scope" })).toEqual({});
  });

  it("allows remapping keys", () => {
    const keysMap = {
      a: "AA",
      b: "BB"
    };
    const input = dedent`
      @scope:registry=https://scope
      //scope:a=1
      //scope:b=2
    `;
    expect(parse({ input, scope: "@scope", keysMap })).toEqual({
      AA: "1",
      BB: "2"
    });
  });
});
