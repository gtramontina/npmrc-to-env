const exec = require("util").promisify(require("child_process").exec);
const tempWrite = require("temp-write");
const dedent = require("dedent");
const toBase64 = str => Buffer(str).toString("base64");

const bin = "./bin/npmrc-to-env.js";

describe("command line interface", () => {
  const npmrc = tempWrite.sync(dedent`
    @scope-http:registry=http://scope-http
    //scope-http:username=scope-http-username

    @scope-https:registry=https://scope-https
    //scope-https:username=scope-https-username

    @scope-password:registry=https://scope-password
    //scope-password:_password="${toBase64("scope-s3cr37-p4ssw0rd")}"

    @scope-username:registry=https://scope-username
    //scope-username:username=scope-username

    @scope-email:registry=https://scope-email
    //scope-email:email=scope-email

    @scope-alwaysAuth:registry=https://scope-alwaysAuth
    //scope-alwaysAuth:always-auth=scope-alwaysAuth

    @scope-authToken:registry=https://scope-authToken
    //scope-authToken:_authToken=scope-authToken

    @scope-all:registry=https://scope-all
    //scope-all:_password="${toBase64("scope-all-s3cr37-p4ssw0rd")}"
    //scope-all:username=scope-all-username
    //scope-all:email=scope-all-email
    //scope-all:always-auth=scope-all-alwaysAuth
    //scope-all:_authToken=scope-all-authToken

    registry=https://public.registry
    //public.registry:_authToken=public.registry-authToken
  `);

  it("parses the public registry's properties if no scope is provided", async () => {
    const { stdout } = await exec(`cat ${npmrc} | ${bin}`);
    expect(stdout).toEqual("NPM_TOKEN=public.registry-authToken");
  });

  it("understands an HTTP registry", async () => {
    const { stdout } = await exec(`cat ${npmrc} | ${bin} --scope @scope-http`);
    expect(stdout).toEqual("NPM_USERNAME=scope-http-username");
  });

  it("understands an HTTPS registry", async () => {
    const { stdout } = await exec(`cat ${npmrc} | ${bin} --scope @scope-https`);
    expect(stdout).toEqual("NPM_USERNAME=scope-https-username");
  });

  it("parses the password property of the given scope", async () => {
    const { stdout } = await exec(
      `cat ${npmrc} | ${bin} --scope @scope-password`
    );
    expect(stdout).toEqual("NPM_PASSWORD=scope-s3cr37-p4ssw0rd");
  });

  it("parses the username property of the given scope", async () => {
    const { stdout } = await exec(
      `cat ${npmrc} | ${bin} --scope @scope-username`
    );
    expect(stdout).toEqual("NPM_USERNAME=scope-username");
  });

  it("parses the email property of the given scope", async () => {
    const { stdout } = await exec(`cat ${npmrc} | ${bin} --scope @scope-email`);
    expect(stdout).toEqual("NPM_EMAIL=scope-email");
  });

  it("parses the alwaysAuth property of the given scope", async () => {
    const { stdout } = await exec(
      `cat ${npmrc} | ${bin} --scope @scope-alwaysAuth`
    );
    expect(stdout).toEqual("NPM_ALWAYS_AUTH=scope-alwaysAuth");
  });

  it("parses the authToken property of the given scope", async () => {
    const { stdout } = await exec(
      `cat ${npmrc} | ${bin} --scope @scope-authToken`
    );
    expect(stdout).toEqual("NPM_TOKEN=scope-authToken");
  });

  it("parses all available attributes for the given scope", async () => {
    const { stdout } = await exec(`cat ${npmrc} | ${bin} --scope @scope-all`);
    expect(stdout).toContain("NPM_EMAIL=scope-all-email");
    expect(stdout).toContain("NPM_USERNAME=scope-all-username");
    expect(stdout).toContain("NPM_PASSWORD=scope-all-s3cr37-p4ssw0rd");
    expect(stdout).toContain("NPM_TOKEN=scope-all-authToken");
    expect(stdout).toContain("NPM_ALWAYS_AUTH=scope-all-alwaysAuth");
  });
});
