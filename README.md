# lws-myword
An npm package implementing a middleware layer for `local-web-server` running on Node.js which dynamically builds an HTML host for URLs referencing MyWord documents.

### Installation

After installing and testing `local-web-server` for Node.js:

	npm install -g lws-myword

### Usage

Insert `lws-myword` or `myword` in the middleware stack before `static``, e.g.,

	ws --stack myword static index

Hint: use the `ws` command line parameter `-h` to verify proper middleware configuration.

`lws-myword` implements two command line parameters:
+`myword.dir		`- directory containing `lib/` from MyWord release, defaults to `/myword`.
+`myword.scripts	`- additional scripts to be loaded; relative URLs from `myword.dir`.

Example:

	ws --myword.dir /myword/dist --myword.scripts CustomElements/custom-elements.min.js --stack myword static index

