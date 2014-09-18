'use strict';
var CoreControllerHelper = require('periodicjs.core.controllerhelper'),
	CoreController,
	Contenttype,
	logger,
	mongoose,
	existingPeriodicContentType,
	newPeriodicalContentTypeDocument = {
		title: 'periodical',
		name: 'periodical',
		attributes: [{
			title: 'dek',
			datatype: 'string',
			name: 'dek',
		}, {
			title: 'effect',
			datatype: 'array',
			defaultvalue: 'push,fadeout,side,sidefixed,jam3',
			name: 'effect',
		}, {
			title: 'static',
			datatype: 'array',
			defaultvalue: 'false,true',
			name: 'static',
		}]
	};

var checkContentTypePeriodical = function (callback) {
	CoreController.loadModel({
		docid: 'periodical',
		model: Contenttype,
		callback: callback
	});
};

var updatePeriodicalContentType = function (callback) {
	CoreController.updateModel({
		model: Contenttype,
		id: existingPeriodicContentType._id,
		updatedoc: newPeriodicalContentTypeDocument,
		callback: callback
	});
};

var createPeriodicalContentType = function (callback) {
	CoreController.createModel({
		model: Contenttype,
		newdoc: newPeriodicalContentTypeDocument,
		callback: callback
	});
};

var setup = function (resources) {
	logger = resources.logger;
	mongoose = resources.mongoose;
	// appSettings = resources.settings,
	CoreController = new CoreControllerHelper(resources);
	Contenttype = mongoose.model('Contenttype');

	mongoose.connection.on('open', function () {
		checkContentTypePeriodical(function (err, doc) {
			if (err) {
				logger.error(err);
			}
			else if (doc) {
				existingPeriodicContentType = doc;
				updatePeriodicalContentType(function (err, updatedcontenttype) {
					if (err) {
						logger.error(err);
					}
					else {
						logger.info('Old Periodical Content Type');
						// console.log(existingPeriodicContentType);
						logger.info('Updated Periodical Content Type');
						// console.log(updatedcontenttype);
					}
				});
			}
			else {
				createPeriodicalContentType(function (err, newcontenttype) {
					if (err) {
						logger.error(err);
					}
					else {
						logger.info('createdNewContentType');
						// console.log(newcontenttype);
					}
				});
			}
		});
	});
};

module.exports = setup;
