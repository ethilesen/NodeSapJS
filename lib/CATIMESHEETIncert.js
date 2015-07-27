var request = require('request');

function CATIMESHEETIncert() {
	this.basePath = 'https://provide.castiron.com/env/DatabaseEP/sap/67c41730-37e0-4953-8a01-3a6fbe0ef8b4';
}

CATIMESHEETIncert.prototype.getBasePath = function () {
	return this.basePath;
};

CATIMESHEETIncert.prototype.setBasePath = function (basePath) {
	this.basePath = basePath;
};

CATIMESHEETIncert.prototype.setAPICredentials = function (username, password) {
	this.username = username;
	this.password = password;
};
CATIMESHEETIncert.prototype.setAPISecretKey = function (secretKey) {
	this.secretKey = secretKey;
};
CATIMESHEETIncert.prototype.invoke = function (parameters, callback) {
	if (parameters.body === undefined) {
		return callback(new Error('Required parameter "body" has not been supplied'), null);
	}
	var path = '/bapi/CATimeSheetManager/Insert';
	var options = {
		method: 'POST',
		uri: this.basePath + path,
		headers: {},
		qs: {}
	};
	if (this.username === undefined || this.password === undefined) {
		return callback(new Error('API credentials have not been supplied'), null);
	} else if (this.username && this.password) {
		options.auth = {
			user: this.username,
			pass: this.password
		};
	}
	if (this.secretKey === undefined) {
		return callback(new Error('API secret key has not been supplied'), null);
	} else {
		options.headers.API_SECRET = this.secretKey;
	}
	options.json = parameters.body;
	request(options, function (error, response, body) {
		if (error) {
			callback(error, null);
		} else {
			callback(null, body);
		}
	});
};

module.exports = CATIMESHEETIncert;

