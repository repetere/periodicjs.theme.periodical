'use strict';

var Linotype = require('linotypejs'),
	periodicalTheme = require('./periodical.theme'),
	theme = new periodicalTheme(),
	LinotypeCollection,
	backgroundMediaElements;

// var resizeMediaElements = function () {
// 	if (backgroundMediaElements && backgroundMediaElements.length > 0) {
// 		for (var x in backgroundMediaElements) {
// 			if (typeof backgroundMediaElements[x] === 'object') {
// 				var resizeMedia = theme.sizeAndPositionBackgroundMedia(backgroundMediaElements[x]);
// 				var lazyLoadMedia = theme.lazyloadBackgroundMedia(backgroundMediaElements[x]);

// 				backgroundMediaElements[x].addEventListener('load', resizeMedia);
// 				backgroundMediaElements[x].addEventListener('load', lazyLoadMedia);
// 				backgroundMediaElements[x].addEventListener('loadeddata', resizeMedia);
// 				backgroundMediaElements[x].addEventListener('loadeddata', lazyLoadMedia);
// 			}
// 		}
// 	}
// };

window.addEventListener('load', function () {
	LinotypeCollection = new Linotype({
		easing: true,
		continuous: true,
		// callback: function (index) {
		// 	// if (backgroundMediaElements) {
		// 	// 	theme.sizeAndPositionBackgroundMedia(backgroundMediaElements[index]);
		// 	// }
		// }
	});

	window.LinotypeCollection = LinotypeCollection;

	// backgroundMediaElements = document.querySelectorAll('.background-media-element');
	// resizeMediaElements();
}, false);

// window.addEventListener('resize', resizeMediaElements, false);

// document.addEventListener('DOMContentLoaded', function () {
// 	if (!backgroundMediaElements) {
// 		backgroundMediaElements = document.querySelectorAll('.background-media-element');
// 	}
// 	resizeMediaElements();

// }, false);
