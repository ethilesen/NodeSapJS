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
 */

'use strict';
var http = require('http');
var passport = require('passport'); 
var cookieParser = require('cookie-parser');
var session = require('express-session');
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

// render index page
app.get('/sucess', function(req, res) {
  res.render('index');
});


// sso settings
app.use(cookieParser());
app.use(session({resave: 'true', saveUninitialized: 'true' , secret: 'keyboard cat'}));
app.use(passport.initialize());
app.use(passport.session()); 

passport.serializeUser(function(user, done) {
   done(null, user);
}); 

passport.deserializeUser(function(obj, done) {
   done(null, obj);
});     

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.  
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var ssoConfig = services.SingleSignOn[0]; 
var client_id = ssoConfig.credentials.clientId;
var client_secret = ssoConfig.credentials.secret;
var authorization_url = ssoConfig.credentials.authorizationEndpointUrl;
var token_url = ssoConfig.credentials.tokenEndpointUrl;
var issuer_id = ssoConfig.credentials.issuerIdentifier;
var callback_url = "http://statoiltest.mybluemix.net/auth/sso/callback";        

var OpenIDConnectStrategy = require('passport-idaas-openidconnect').IDaaSOIDCStrategy;
var Strategy = new OpenIDConnectStrategy({
                 authorizationURL : authorization_url,
                 tokenURL : token_url,
                 clientID : client_id,
                 scope: 'openid',
                 response_type: 'code',
                 clientSecret : client_secret,
                 callbackURL : callback_url,
                 skipUserProfile: true,
                 issuer: issuer_id}, 
	function(iss, sub, profile, accessToken, refreshToken, params, done)  {
	         	process.nextTick(function() {
		profile.accessToken = accessToken;
		profile.refreshToken = refreshToken;
		done(null, profile);
         	})
}); 

passport.use(Strategy); 
app.get('/', passport.authenticate('openidconnect', {})); 
          
function ensureAuthenticated(req, res, next) {
	if(!req.isAuthenticated()) {
	          	req.session.originalUrl = req.originalUrl;
		res.redirect('/login');
	} else {
		return next();
	}
}

app.get('/auth/sso/callback',function(req,res,next) {
			var redirect_url = "/sucess";      
            // var redirect_url = req.session.originalUrl;                
             passport.authenticate('openidconnect', {
                     successRedirect: redirect_url,                                
                     failureRedirect: '/failure',                        
          })(req,res,next);
        });
app.get('/failure', function(req, res) { 
             res.send('login failed'); });
// CATIMEGetList
var CATIMEGetList = require('./lib/CATIMEGetList.js');
var api = new CATIMEGetList();
api.setAPICredentials('apiuser@CloudIntegration', 'S!2w3e40');
api.setAPISecretKey('cc282a38b942ec9bf6b748a6c7d3fc155cf7b2daf77a386e4043b42405c64378f19a74584f147e2f8e55872c2f30c17b');

// CATIMESHEETIncert
var CATIMESHEETIncert = require('./lib/CATIMESHEETIncert.js');
var api2 = new CATIMESHEETIncert();
api2.setAPICredentials('apiuser@CloudIntegration', 'S!2w3e40');
api2.setAPISecretKey('72e86a502b1914d34f50f47ac3057d15fbe835827f6f7d00099dde28896a747068140c3dca12f30c1acbc0d369c0c1fc');


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
