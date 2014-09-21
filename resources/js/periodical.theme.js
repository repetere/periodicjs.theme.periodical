'use strict';

var navigationHeader = require('periodicjs.theme-component.navigation-header'),
	classie = require('classie'),
	periodicalNavigation;

var lazyloadBackgroundMedia = function (backgroundMedia) {
	classie.removeClass(backgroundMedia, 'lazyload');
};

var sizeAndPositionBackgroundMedia = function (backgroundMedia) {
	if (backgroundMedia.clientWidth > window.innerWidth || backgroundMedia.clientHeight < window.innerHeight) {
		if (backgroundMedia.clientWidth > window.innerWidth) {
			var offsetMarginLeft = (backgroundMedia.clientWidth - window.innerWidth) / 2 * -1;
			backgroundMedia.style['margin-left'] = offsetMarginLeft + 'px';
		}
		backgroundMedia.style.width = 'auto';
		backgroundMedia.style.height = '100%';
	}
	else if (backgroundMedia.clientWidth <= window.innerWidth) {
		backgroundMedia.style.width = '100%';
		backgroundMedia.style.height = 'auto';
		backgroundMedia.style['margin-left'] = '0px';
		// var offsetMarginTop = (backgroundMedia.clientHeight - window.innerHeight) / 2 * -1;
		// backgroundMedia.style.top = offsetMarginTop + 'px';
	}
	if (classie.hasClass(backgroundMedia, 'lazyload')) {
		lazyloadBackgroundMedia(backgroundMedia);
	}
};

var periodicaltheme = function () {
	window.addEventListener('load', function () {
		periodicalNavigation = new navigationHeader({
			idSelector: 'ha-header'
		});
		window.periodicalthemenavigation = periodicalNavigation;
	}, false);

	return {
		navigation: periodicalNavigation,
		sizeAndPositionBackgroundMedia: sizeAndPositionBackgroundMedia,
		lazyloadBackgroundMedia: lazyloadBackgroundMedia
	};
};

module.exports = periodicaltheme;
