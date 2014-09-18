'use strict';
var CoreControllerHelper = require('periodicjs.core.controllerhelper'),
	CoreController,
	Contenttype,
	AppDBSetting,
	logger,
	mongoose,
	existingPeriodicContentType,
	usablePeriodicContentType,
	itemDefaultContenttype,
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

var createDefaultItemContentType = function () {
	var newDefaultItemContentType = {
		name: 'item_default_contenttypes'
	};

	CoreController.createModel({
		model: AppDBSetting,
		newdoc: newDefaultItemContentType,
		callback: function (err, newappsettingdocument) {
			if (err) {
				logger.error(err);
			}
			else {
				itemDefaultContenttype = newappsettingdocument;
				logger.silly('add newly created default content type');
				updateDefaultItemContentType(itemDefaultContenttype);
			}
		}
	});
};

var updateDefaultItemContentType = function (appsettingdocumenttouse) {
	var alreadyHasDefault = false;
	for (var x in appsettingdocumenttouse.value) {
		if (usablePeriodicContentType._id.toString() === appsettingdocumenttouse.value[x].toString()) {
			alreadyHasDefault = true;
		}
	}
	if (alreadyHasDefault) {
		logger.silly('appsettingdocumenttouse.value', appsettingdocumenttouse.value, 'already has', usablePeriodicContentType._id);
	}
	else {
		var objectToModify = {
			'value': usablePeriodicContentType._id
		};
		CoreController.updateModel({
			model: AppDBSetting,
			id: appsettingdocumenttouse._id,
			appendArray: true,
			updatedoc: objectToModify,
			callback: function (err, updatedsetting) {
				if (err) {
					logger.error(err);
				}
				else {
					console.log('updated settings', updatedsetting);
				}
			}
		});
	}
};

var addDefaultItemContentType = function () {
	CoreController.loadModel({
		docid: 'item_default_contenttypes',
		model: AppDBSetting,
		callback: function (err, appsettingdocument) {
			if (err) {
				logger.error(err);
			}
			else if (appsettingdocument) {
				itemDefaultContenttype = appsettingdocument;
				logger.silly('add default content type');
				updateDefaultItemContentType(itemDefaultContenttype);
			}
			else {
				logger.silly('create new default item content type');
				createDefaultItemContentType();
			}
		}
	});
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
	AppDBSetting = mongoose.model('Setting');

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
						usablePeriodicContentType = updatedcontenttype;
						addDefaultItemContentType();
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
						usablePeriodicContentType = newcontenttype;
						addDefaultItemContentType();
					}
				});
			}
		});
	});
};

module.exports = setup;
