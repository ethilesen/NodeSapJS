
/*function example_invoke() {
	console.log(api);
	// Set up the request parameters for the invoke operation.
	var request = {};
	request.body = { "CATimeSheetRecord.GetList": {
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
*/

