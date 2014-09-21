'use strict';

var Linotype = require('linotypejs'),
	periodicalTheme = require('./periodical.theme'),
	theme = new periodicalTheme(),
	LinotypeCollection;

window.addEventListener('load', function () {
	LinotypeCollection = new Linotype({
		easing: true
	});

	window.LinotypeCollection = LinotypeCollection;
}, false);
