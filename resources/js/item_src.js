'use strict';

var classie = require('classie'),
	periodicalTheme = require('./periodical.theme'),
	theme = new periodicalTheme(),
	keys = [32, 37, 38, 39, 40],
	wheelIter = 0, // disable/enable scroll (mousewheel and keys) from http://stackoverflow.com/a/4770179					
	// left: 37, up: 38, right: 39, down: 40,
	// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
	docElem = window.document.documentElement,
	backgroundMedia,
	scrollVal,
	isRevealed,
	noscroll,
	isAnimating,
	container,
	resizeMedia,
	lazyLoadMedia,
	trigger;

// detect if IE : from http://stackoverflow.com/a/16657946		
var ie = function () {
	var undef, rv = -1; // Return value assumes failure.
	var ua = window.navigator.userAgent;
	var msie = ua.indexOf('MSIE ');
	var trident = ua.indexOf('Trident/');

	if (msie > 0) {
		// IE 10 or older => return version number
		rv = parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
	}
	else if (trident > 0) {
		// IE 11 (or newer) => return version number
		var rvNum = ua.indexOf('rv:');
		rv = parseInt(ua.substring(rvNum + 3, ua.indexOf('.', rvNum)), 10);
	}

	return ((rv > -1) ? rv : undef);
};

var preventDefault = function (e) {
	e = e || window.event;
	if (e.preventDefault) {
		e.preventDefault();
	}
	e.returnValue = false;
};

var keydown = function (e) {
	for (var i = keys.length; i--;) {
		if (e.keyCode === keys[i]) {
			preventDefault(e);
			return;
		}
	}
};

var touchmove = function (e) {
	preventDefault(e);
};

var wheel = function ( /* e */ ) {
	// for IE 
	//if( ie ) {
	//preventDefault(e);
	//}
};

var disable_scroll = function () {
	window.onmousewheel = document.onmousewheel = wheel;
	document.onkeydown = keydown;
	document.body.ontouchmove = touchmove;
};

var enable_scroll = function () {
	window.onmousewheel = document.onmousewheel = document.onkeydown = document.body.ontouchmove = null;
};

var scrollY = function () {
	return window.pageYOffset || docElem.scrollTop;
};

var toggle = function (reveal) {
	backgroundMedia = document.getElementById('background-media-element');
	resizeMedia = theme.sizeAndPositionBackgroundMedia(backgroundMedia);
	isAnimating = true;

	if (container) {
		if (reveal) {
			classie.add(container, 'modify');
		}
		else {
			noscroll = true;
			disable_scroll();
			classie.remove(container, 'modify');
			if (backgroundMedia) {
				theme.sizeAndPositionBackgroundMedia(backgroundMedia);
			}
		}
	}

	// simulating the end of the transition:
	setTimeout(function () {
		isRevealed = !isRevealed;
		isAnimating = false;
		if (reveal) {
			noscroll = false;
			enable_scroll();
		}
	}, 1200);
};

var scrollPage = function () {
	backgroundMedia = document.getElementById('background-media-element');
	resizeMedia = theme.sizeAndPositionBackgroundMedia(backgroundMedia);
	scrollVal = scrollY();

	if (noscroll && !ie) {
		if (scrollVal < 0) {
			return false;
		}
		// keep it that way
		window.scrollTo(0, 0);
	}

	if (container && classie.has(container, 'notrans')) {
		if (backgroundMedia) {
			theme.sizeAndPositionBackgroundMedia(backgroundMedia);
		}
		classie.remove(container, 'notrans');
		return false;
	}

	if (isAnimating) {
		return false;
	}

	if (scrollVal <= 0 && isRevealed) {
		toggle(0);
	}
	else if (scrollVal > 0 && !isRevealed) {
		toggle(1);
	}
};

document.addEventListener('DOMContentLoaded', function ( /* e */ ) {
	backgroundMedia = document.getElementById('background-media-element');
	resizeMedia = theme.sizeAndPositionBackgroundMedia(backgroundMedia);
	backgroundMedia.addEventListener('load', resizeMedia);
	backgroundMedia.addEventListener('loadeddata', resizeMedia);
}, false);

window.addEventListener('resize', function ( /* e */ ) {
	if (backgroundMedia) {
		theme.sizeAndPositionBackgroundMedia(backgroundMedia);
	}
});

window.addEventListener('scroll', scrollPage, false);

window.addEventListener('load', function () {
	backgroundMedia = document.getElementById('background-media-element');
	container = document.getElementById('container');
	trigger = container.querySelector('button.trigger');
	resizeMedia = theme.sizeAndPositionBackgroundMedia(backgroundMedia);
	lazyLoadMedia = theme.lazyloadBackgroundMedia(backgroundMedia);
	// refreshing the page...
	var pageScroll = scrollY();
	noscroll = pageScroll === 0;

	disable_scroll();

	if (pageScroll) {
		isRevealed = true;
		classie.add(container, 'notrans');
		classie.add(container, 'modify');
	}

	trigger.addEventListener('click', function () {
		toggle('reveal');
	});

}, false);
