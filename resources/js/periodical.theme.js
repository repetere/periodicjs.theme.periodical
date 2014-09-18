'use strict';

var navigationHeader = require('periodicjs.theme-component.navigation-header'),
	periodicalNavigation;

var periodicaltheme = function () {
	window.addEventListener('load', function () {
		periodicalNavigation = new navigationHeader({
			idSelector: 'ha-header'
		});
		window.periodicalthemenavigation = periodicalNavigation;
	}, false);

	return {
		navigation: periodicalNavigation
	};
};

module.exports = periodicaltheme;
