# Async Clipboard [![License][LicenseIMGURL]][LicenseURL] [![NPM version][NPMIMGURL]][NPMURL] [![Dependency Status][DependencyStatusIMGURL]][DependencyStatusURL] [![Build Status][BuildStatusIMGURL]][BuildStatusURL] [![Coverage Status][CoverageIMGURL]][CoverageURL]

[Async clipboard api](https://w3c.github.io/clipboard-apis/) uses `navigator.clipboard` if available or smallest `polyfill` in the world.

## Install

```
npm i @cloudcmd/clipboard
```

## API

### writeText(str)

Write text to clipboard.

```js
const clipboard = require('@cloudcmd/clipboard');

clipboard.writeText('hello')
    .then(console.log)
    .catch(console.error);
```

## License

MIT

[NPMIMGURL]:                https://img.shields.io/npm/v/@cloudcmd/clipboard.svg?style=flat
[BuildStatusIMGURL]:        https://img.shields.io/travis/cloudcmd/clipboard/master.svg?style=flat
[DependencyStatusIMGURL]:   https://img.shields.io/david/cloudcmd/clipboard.svg?style=flat
[LicenseIMGURL]:            https://img.shields.io/badge/license-MIT-317BF9.svg?style=flat
[CoverageIMGURL]:           https://coveralls.io/repos/cloudcmd/clipboard/badge.svg?branch=master&service=github
[NPMURL]:                   https://npmjs.org/package/@cloudcmd/clipboard "npm"
[BuildStatusURL]:           https://travis-ci.org/cloudcmd/clipboard  "Build Status"
[DependencyStatusURL]:      https://david-dm.org/cloudcmd/clipboard "Dependency Status"
[LicenseURL]:               https://tldrlegal.com/license/mit-license "MIT License"
[CoverageURL]:              https://coveralls.io/github/cloudcmd/clipboard?branch=master

