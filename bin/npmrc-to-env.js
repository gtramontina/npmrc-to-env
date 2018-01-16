#!/usr/bin/env node

const { name } = require("../package");
const USAGE = `
  Usage:
    ${name} [options]

  Options:
    -s --scope <scope>    Scope from which information will be extracted.

  Examples
    $ cat ~/.npmrc | ${name}
    $ cat ~/.npmrc | ${name} -s @myscope
`;

// ---

const meow = require("meow");
const stdin = require("get-stdin");
const { parse, toEnv, defaultKeysMap } = require("../lib");
const { flags } = meow(USAGE, { flags: { scope: { alias: "s" } } });
const { scope } = flags;

(async () => {
  const input = await stdin();
  const result = parse({ input, scope, keysMap: defaultKeysMap });
  process.stdout.write(toEnv(result));
})();
