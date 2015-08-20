/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * IBM: Espen Thilesen / espen.thilesen@no.ibm.com
 */

'use strict';
var http = require('http');
var express = require('express'),
  app = express(),
  request = require('request'),
  bluemix = require('./config/bluemix'),
  fs = require('fs');

// Bootstrap application settings
require('./config/express')(app);
var port = process.env.VCAP_APP_PORT || 3000;
var hostn = process.env.VCAP_APP_HOST || "localhost";



// render index page if sso sucess
app.get('/', function(req, res) {
  res.render('index');
});





// CATIMEGetList
var CATIMEGetList = require('./lib/CATIMEGetList.js');
var api = new CATIMEGetList();
api.setAPICredentials('USERNAME', 'PASSWD');
api.setAPISecretKey('KEY');

// CATIMESHEETIncert
var CATIMESHEETIncert = require('./lib/CATIMESHEETIncert.js');
var api2 = new CATIMESHEETIncert();
api2.setAPICredentials('USERNAME', 'PASSWD');
api2.setAPISecretKey('KEY');


app.post('/getTimesheet', function (req, res) {
	// logging request...
	console.log(JSON.stringify(req.body));

	request.body = { "CATimeSheetRecord.GetList": {
		"FromDate": req.body.s.fdate,
		"ToDate": req.body.s.tdate,
		"SelEmployee": {
			"item": {
				"SIGN": "I",
				"OPTION": "EQ",
				"HIGH": req.body.s.empnrf,
				"LOW": req.body.s.empnrt
			}
		}
	}
	};
		// Invoke the invoke operation.
			console.log("This to be requested: " + JSON.stringify(request.body))
			api.invoke(request, function (error, response) {

			// Handle any errors from the invoke operation.
			if (error) {
				console.log(error);
				throw error;

			}

			// Handle the response from the invoke operation.
			console.log("This are the result: " + JSON.stringify(response));
			try  {
        var result = JSON.stringify(response['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item']);
      }
      catch (err){
        console.log("Obs.. the SAP system does not respond as expected: ");
        res.send("Obs.. the SAP system does not respond as expected: " + err +':'+result);
        return 0;
      }
			//res.send(JSON.stringify(response['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item']));
      console.log("got Items.."+result);
			res.send(JSON.stringify(response));
		});
});
app.post('/sendTimesheet', function (req, res) {
	var request = {};
		request.body = {
			// TODO: insert required body object here.
			"CATimeSheetManager.Insert": {
		    "Profile": "ESS",
		  // "Testrun": "X",
		    "CatsrecordsIn":{
		      "item": {
		        "WORKDATE": req.body.s.wdate,
		        "EMPLOYEENUMBER": req.body.s.empnr,
		        "SEND_CCTR": "0000004300",
		        "ACTTYPE": "1410",
		        "WBS_ELEMENT": "I/4004",
		        "ABS_ATT_TYPE": "0800",
		        "STARTTIME": req.body.s.stime,
		        "ENDTIME": req.body.s.etime,
				"SHORTTEXT": req.body.s.stext
		      }
		    }
		  }
		};

		// Invoke the invoke operation.
			console.log("This to be requested: " + JSON.stringify(request.body))
			api2.invoke(request, function (error, response) {

			// Handle any errors from the invoke operation.
			if (error) {
				console.log("API generated errors...." + error);
				throw error;

			}

			// Handle the response from the invoke operation.


        console.log("Dette er response: "+JSON.stringify(response));

      try{
        var resultstr = JSON.stringify(response);
        res.send(resultstr);
        return 0;
      }
      catch(error){
        console.log("Obs.." + error);
      }
      console.log("Sender som txt");
      res.send(response);//  conso
		});
});
app.listen(port);
console.log('listening at:', port);
