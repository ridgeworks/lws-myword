module.exports = MiddlewareBase => class MyWord extends MiddlewareBase {
	
	description () {
		return 'Serves MyWord document requests.'
	}  // description ()

	optionDefinitions () {
		// e.g., --myword.dir /myword --myword.scripts mj3-mml2html-global.dist.js CustomElements/custom-elements.min.js
		return [
			{name: 'myword.dir',
			 type: String,
			 typeLabel: '[underline]{path}',
			 description: 'Directory containing MyWord `lib/`, defaults to `/myword/`.'
			},
			{name: 'myword.scripts',
			 type: String,
			 multiple: true,
			 typeLabel: '[underline]{path ...}',
			 description: 'List of additional scripts to load from MyWord directory.'
			}
		]
	}  // optionDefinitions ()
	
	middleware (options) {
		return async (ctx, next) => {
			// MyWord document URLs have path suffix of '.myw' and an Accept header containing 'text/html'
			if (ctx.path.endsWith('.myw') && (ctx.header['accept'].indexOf('text/html') !== -1)) {
				ctx.response.header['Content-type'] = 'text/html'
				ctx.response.header['Access-Control-Allow-Origin'] = '*'
				const myword_options = options || {mywordDir: '/myword/', mywordScripts: []}
				const myword_dir = options.mywordDir ? options.mywordDir : '/myword'
				const myword_url = ctx.origin + myword_dir + (myword_dir.endsWith('/') ? '' : '/')
				const myword_scripts = ((options.mywordScripts) ? options.mywordScripts : [])
					.concat(['lib/x-markup.js'])
					.reduce(
						(elements, script) =>
						      elements + ["  <script type='text/javascript' src='",
										          // if absolute URL (starts with '/' or contains '://') then don't prepend myword.url
						                  /^\/|:\/\//.test(script) ? script : myword_url + script,
						                  "'></script>\n"
						                 ].join(''),
						''
					 )
				ctx.body = `<!DOCTYPE HTML>
<html>
<head>
<meta lang=en charset='UTF-8'>
${myword_scripts}
</head>
<body>
<div class=x-markup src='${ctx.origin + ctx.url}'></div>
</body>
</html>
				`
			} else {          // Not a MyWord document request
				await next()  // pass it on
			}
		}
	}  // middleware (options)
	
}  // class MyWord
