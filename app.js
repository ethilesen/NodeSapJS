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
 * Test endring remote
 */

'use strict';
var http = require('http');
var express = require('express'),
  app = express(),
  request = require('request'),
  path = require('path'),
  bluemix = require('./config/bluemix'),
  validator = require('validator'),
  //watson = require('watson-developer-cloud'),
  extend = require('util')._extend,
  fs = require('fs');

// Bootstrap application settings
require('./config/express')(app);
var port = process.env.VCAP_APP_PORT || 3000;

var hostn = process.env.VCAP_APP_HOST || "localhost";
// if bluemix credentials exists, then override local
var credentials = extend({
  version: 'v1',
  username: '<username>',
  password: '<password>'
}, bluemix.getServiceCreds('visual_recognition')); // VCAP_SERVICES

// Create the service wrapper
//var visualRecognition = watson.visual_recognition(credentials);

// render index page
app.get('/', function(req, res) {
  res.render('index');
});

// gettimesheet
var CATIMEGetList = require('./lib/CATIMEGetList.js');
var api = new CATIMEGetList();
api.setAPICredentials('apiuser@CloudIntegration', 'S!2w3e40');
api.setAPISecretKey('cc282a38b942ec9bf6b748a6c7d3fc155cf7b2daf77a386e4043b42405c64378f19a74584f147e2f8e55872c2f30c17b');

//
var CATIMESHEETIncert = require('./lib/CATIMESHEETIncert.js');
var api2 = new CATIMESHEETIncert();
api2.setAPICredentials('apiuser@CloudIntegration', 'S!2w3e40');
api2.setAPISecretKey('72e86a502b1914d34f50f47ac3057d15fbe835827f6f7d00099dde28896a747068140c3dca12f30c1acbc0d369c0c1fc');


app.post('/getTimesheet', function (req, res) {
	
	//var data = req.body;	
	console.log("req.body.fdate: " +req.body.s.fdate);
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
			//res.redirect('/')
			//res.redirect('/');
			//res.render('index.jade');
			//res.send(JSON.stringify(response['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item']));
			res.send(JSON.stringify(response));
		});
});
app.post('/sendTimesheet', function (req, res) {
	
	//var data = req.body;	
	console.log("req.body.fdate: " +req.body.s.fdate);
	console.log(JSON.stringify(req.body));
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
		        "STARTTIME": "13:00:00",
		        "ENDTIME": "17:30:00",
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
				console.log(error);
				throw error;
				
			}

			// Handle the response from the invoke operation.
			console.log("This are the result: " + JSON.stringify(response));
			//res.redirect('/')
			//res.redirect('/');
			//res.render('index.jade');
			//res.send(JSON.stringify(response['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item']));
			res.send(JSON.stringify(response));
		});
});


/* WebSocket server
wsServer.on('request', function(request) {
    var connection = request.accept(null, request.origin);

    // This is the most important callback for us, we'll handle
    // all messages from users here.
	//var connection = request.accept('echo-protocol', request.origin);
	    console.log((new Date()) + ' Connection accepted.');
	
    connection.on('message', function(message) {
		
        if (message.type === 'utf8') {
            console.log(message.utf8Data);
			var result=JSON.parse(message.utf8Data);
			console.log(result.fdate);
			if (result.qtype == 'glist'){
			var request = {};
			request.body={ "CATimeSheetRecord.GetList": {
				"FromDate": result.fdate,
				"ToDate": result.tdate,
				"SelEmployee": {
					"item": {
						"SIGN": "I",
						"OPTION": "EQ",
						"HIGH": result.empnrf,
						"LOW": result.empnrt
						}
					}
				}
			};
			api.invoke(request, function (error, response) {
			
			// Handle any errors from the invoke operation.
			if (error) {
				console.log(error);
				throw error;
				
			}

			// Handle the response from the invoke operation.
			console.log(JSON.stringify(response));
			connection.send(JSON.stringify(response));
			//res.redirect('/')
			//res.redirect('/');
			//res.render('index.jade');
			//res.send(JSON.stringify(response['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item']));
			//res.send(response);
			});
			
			} else {
				console.log("Starter insert timesheet");
				var result=JSON.parse(message.utf8Data);
				var request = {};
					request.body = {
						// TODO: insert required body object here.
						"CATimeSheetManager.Insert": {
					    "Profile": "ESS",
					  // "Testrun": "X",
					    "CatsrecordsIn":{
					      "item": {
					        "WORKDATE": result.wdate,
					        "EMPLOYEENUMBER": result.empnr,
					        "SEND_CCTR": "0000004300",
					        "ACTTYPE": "1410",
					        "WBS_ELEMENT": "I/4004",
					        "ABS_ATT_TYPE": "0800",
					        "STARTTIME": result.s.stime,
					        "ENDTIME": result.s.etime,
							"SHORTTEXT": result.stext
					      }
					    }
					  }
					};

					// Invoke the invoke operation.
					api2.invoke(request, function (error, response) {

						// Handle any errors from the invoke operation.
						if (error) {
							console.log(error);
							throw error;
						}

						// Handle the response from the invoke operation.
						console.log(JSON.stringify(response));
						connection.sendUTF(response);


					});

				
			} // end else

			
	
	    //
		}
    });

    connection.on('close', function(connection) {
        // close user connection
    });
});
*/

app.listen(port);
console.log('listening at:', port);