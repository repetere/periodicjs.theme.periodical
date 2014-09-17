(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*
 * classie
 * http://github.amexpub.com/modules/classie
 *
 * Copyright (c) 2013 AmexPub. All rights reserved.
 */

module.exports = require('./lib/classie');

},{"./lib/classie":2}],2:[function(require,module,exports){
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */
'use strict';

  // class helper functions from bonzo https://github.com/ded/bonzo

  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if (typeof document === "object" && 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // transport

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    // commonjs / browserify
    module.exports = classie;
  } else {
    // AMD
    define(classie);
  }

  // If there is a window object, that at least has a document property,
  // define classie
  if ( typeof window === "object" && typeof window.document === "object" ) {
    window.classie = classie;
  }
},{}],3:[function(require,module,exports){
'use strict';

var classie = require('classie'),
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
	isAnimating = true;

	if (container) {
		if (reveal) {
			classie.add(container, 'modify');
		}
		else {
			noscroll = true;
			disable_scroll();
			classie.remove(container, 'modify');
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
	scrollVal = scrollY();

	if (noscroll && !ie) {
		if (scrollVal < 0) {
			return false;
		}
		// keep it that way
		window.scrollTo(0, 0);
	}

	if (container && classie.has(container, 'notrans')) {
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

var lazyloadBackgroundMedia = function () {
	classie.removeClass(backgroundMedia, 'lazyload');
};

var sizeAndPositionBackgroundMedia = function () {
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
		lazyloadBackgroundMedia();
	}
};

document.addEventListener('DOMContentLoaded', function ( /* e */ ) {
	backgroundMedia = document.getElementById('background-media-element');
	backgroundMedia.addEventListener('load', sizeAndPositionBackgroundMedia);
	backgroundMedia.addEventListener('loadeddata', sizeAndPositionBackgroundMedia);
}, false);

window.addEventListener('resize', function ( /* e */ ) {
	sizeAndPositionBackgroundMedia();
});

window.addEventListener('scroll', scrollPage, false);

window.addEventListener('load', function () {
	backgroundMedia = document.getElementById('background-media-element');
	container = document.getElementById('container');
	trigger = container.querySelector('button.trigger');
	sizeAndPositionBackgroundMedia();
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

},{"classie":1}]},{},[3]);
