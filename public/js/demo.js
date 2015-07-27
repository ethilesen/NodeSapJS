// Example for the invoke operation.
function example_invoke() {
	
	var CATIMEGetList = require('/lib/CATIMEGetList.js');

// Create a new instance of the API class.
	var api = new CATIMEGetList();

// Set the API credentials.
	// TODO: replace username and password with those from the API definition.
api.setAPICredentials('apiuser@CloudIntegration', 'S!2w3e40');
// Set the API secret key.
// TODO: replace secret key with that from the API definition.
api.setAPISecretKey('cc282a38b942ec9bf6b748a6c7d3fc155cf7b2daf77a386e4043b42405c64378f19a74584f147e2f8e55872c2f30c17b');

	// Set up the request parameters for the invoke operation.
	var request = {};
	request.body = {"CATimeSheetRecord.GetList": {
		"FromDate": "20150609",
		"ToDate": "20150611",
		"SelEmployee": {
		"item": {
			"SIGN": "I",
			"OPTION": "EQ",
			"HIGH": "00001809",
			"LOW": "00001809"
			}
			}	
		}
		};

	// Invoke the invoke operation.
	api.invoke(request, function (error, response) {
		console.log("start api call");
		// Handle any errors from the invoke operation.
		if (error) {
			console.log(error);
			throw error;
		}

		// Handle the response from the invoke operation.
		console.log(JSON.stringify(response));


	});

}

