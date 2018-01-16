# npmrc-to-env

<p align="center" valign="middle">
  <a href="http://npm.im/npmrc-to-env"><img height="20" alt="Version" src="https://img.shields.io/npm/v/npmrc-to-env.svg?style=for-the-badge"></a>
  <a href="https://travis-ci.org/gtramontina/npmrc-to-env"><img height="20" alt="Build Status" src="https://img.shields.io/travis/gtramontina/npmrc-to-env.svg?style=for-the-badge"></a>
  <a href="http://opensource.org/licenses/MIT"><img height="20" alt="MIT License" src="https://img.shields.io/npm/l/npmrc-to-env.svg?style=for-the-badge"></a>
  <a href="http://npm-stat.com/charts.html?package=npmrc-to-env&from=2018-01-01"><img height="20" alt="Downloads" src="https://img.shields.io/npm/dm/npmrc-to-env.svg?style=for-the-badge"></a>
  <a href="https://github.com/semantic-release/semantic-release"><img height="20" alt="Semantic Release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=for-the-badge"></a>
</p>

## Why?

If all you have at hand is an `.npmrc` file, but you need exported environment variables to properly setup CI environments, for example, then this program comes in handy.

## How?

```sh
$ npmrc-to-env --help

  Usage:
    npmrc-to-env [options]

  Options:
    -s --scope <scope>    Scope from which information will be extracted.

  Examples
    $ cat ~/.npmrc | npmrc-to-env
    $ cat ~/.npmrc | npmrc-to-env -s @myscope
```

You can, then, `export` the generated environment variables with:

```sh
$ export $(cat ~/.npmrc | npmrc-to-env | xargs)
```

Although all examples use `~/.npmrc` as the source, it can be whatever `.npmrc` file you have.

## Development

This repository holds a standard NodeJS project, so you can run all node-related commands, such as `npm install`, `npm test`, and whatnot. We do, however, use `yarn` do handle the dependencies. This shouldn't be a big deal, though.

Now, if you don't want to have to deal with having the right node version, yarn or whatever else installed locally, and you already have `docker`, then all you need to do is prefix any command you want to run with `make run --` and we'll take care of everything. Like so:

```sh
$ make run -- yarn test
$ make run -- yarn test --watch
$ make run -- yarn …
$ make run -- npx …
$ make run -- sh
```

## License

This software is licensed under the MIT license
