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
/*global $:false */


/**
 * Anonymous function, to use as a wrapper
 */


/*
function test(message){
	console.log("Hei...");
    $('.loading').show();
    $('.result').show();
    $('.error').hide();
    $('.data').empty();
	$('.status').show().html(message);
}
function hentT(pl){
	console.log(pl);
    $('.loading').show();
    $('.result').show();
	var req = pl | { "CATimeSheetRecord.GetList": {
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
	$.post( "./getTimeList", function(req,res){
	    
		console.log( "Load was performed." + req);
		//console.log(data);
		
		$('.result').show().html(req);
		$('.loading').hide();
		
		
	});
}
*/
//$.getScript("/js/ReconnectingWebSocket.js", function(){

//			   console.log("Script loaded but not necessarily executed.");
// form 1
  var form = document.getElementById('gtlist');
  var fdate = document.getElementById('fdate');
  var tdate = document.getElementById('tdate');
  var empnrf = document.getElementById('empnrf');
  var empnrt = document.getElementById('empnrt');
  var messagesList = document.getElementById('messages');
  
// form 2
  var form2 = document.getElementById('slist');
  var profile = document.getElementById('profile');
  var wdate = document.getElementById('wdate');
  var empnr = document.getElementById('empnr');
  var scctr = document.getElementById('scctr');
  var messagesList = document.getElementById('messages');
/*  
  var url = window.location.hostname|| "localhost:3001";
var ws = new ReconnectingWebSocket('ws://'+url+'/ws/apicall');

ws.onopen = function(evt) { onOpen(evt) };
ws.onclose = function(evt) { onClose(evt) };
ws.onmessage = function(evt) { onMessage(evt) };
ws.onerror = function(evt) { onError(evt) };

function onClose(evt) { 
		console.log("onClose"); 
		
		
		 };
	function onOpen(evt) { 
			console.log("onOpen "); 
			
			
			 };
	function onMessage(evt) { 
		if (evt.data.lastIndexOf('{"CATimeSheetRecord.GetList.Response"', 0) === 0){
		
		//if (JSON.parse(evt.data)['CATimeSheetRecord.GetList.Response']){
		console.log(JSON.parse(evt.data)['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']);
		var data = JSON.parse(evt.data)['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item'];
		//$('#messages').html(JSON.stringify(data));
		var tr; 
		
		//tr.append('<th>EmpNumber</th>');
		//tr.append('<th>Workdate</th>');
		//tr.append('<th>Start time</th>');
		 $.each(data, function( index, value ) {
			// alert( index + ": " + JSON.stringify(value.WORKDATE) );
		tr = $('<tr/>');
		
		tr.append('<td>'+value.EMPLOYEENUMBER+'</td>');
		tr.append('<td>'+value.CATSHOURS+'</td>');
		tr.append('<td>'+value.WORKDATE+'</td>');
		tr.append('<td>'+value.STARTTIME+'</td>');
	 	tr.append('<td>'+value.ENDTIME+'</td>');
		tr.append('<td>'+value.SHORTTEXT+'</td>');
		$('.loading').hide();
		$('.result').hide();
		$('#tabell').append(tr); 
		 });
	 }  else if (evt.data.lastIndexOf('{"CATimeSheetManager.Insert.Response"', 0) === 0){
		 console.log("fant");
		 //var data = JSON.parse(evt.data);
		 //console.log(data);
	 
		 //CATimeSheetManager.Insert.Response":{"CatsrecordsOut":{"item
		 
 		$('.loading').hide();
 		$('.result').hide();
		
		$('#tabell').html(evt.data['CATimeSheetManager.Insert.Response']);
		 
		 
	 } else if (evt.data.lastIndexOf('{"Fault"', 0) === 0){
   		$('.loading').hide();
   		$('.result').hide();
		
  		$('#tabell').html("Error...."+JSON.stringify(evt.data));
	 	
	 }else {
		 console.log("ERROR not known datatype returned...");
  		$('.loading').hide();
  		$('.result').hide();
		
 		$('#tabell').html("Something went wrong...."+evt.data);
		console.log(toString(evt.data));
		 
	 }	
				
			};
	function onError(evt) { 
				
					};
	function send(data) {
		console.log("sender: "+data);
		ws.send(data);
					}
  */
form.onsubmit = function(e) {
	e.preventDefault();

// Retrieve the message from the textarea.
	 var message = {"qtype":"glist","fdate":fdate.value,"tdate":tdate.value,"empnrf":empnrf.value,"empnrt":empnrt.value};	
	 var url = '/GetTimeSheet';
	 $('#tabell').html('');
   	 $('.result').show();
   	 $('.loading').show();
	 var posting = $.post( url, { s: message } );
	 posting.done(function( data ) {
		 console.log("got: "+ data);
		 
 		if (data.lastIndexOf('{"CATimeSheetRecord.GetList.Response"', 0) === 0){
		
 		var data = JSON.parse(data)['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item'];
 		//$('#messages').html(JSON.stringify(data));
		console.log(JSON.stringify(data));
 		var tr; 
		if (!data[0]){
	 		tr = $('<tr/>');
			console.log("bare 1");
	 		tr.append('<td>'+data.EMPLOYEENUMBER+'</td>');
	 		tr.append('<td>'+data.CATSHOURS+'</td>');
	 		tr.append('<td>'+data.WORKDATE+'</td>');
	 		tr.append('<td>'+data.STARTTIME+'</td>');
	 	 	tr.append('<td>'+data.ENDTIME+'</td>');
	 		tr.append('<td>'+data.SHORTTEXT+'</td>');
	 		$('.loading').hide();
	 		$('.result').hide();
	 		$('#tabell').append(tr); 
		} else {
 		//tr.append('<th>EmpNumber</th>');
 		//tr.append('<th>Workdate</th>');
 		//tr.append('<th>Start time</th>');
 		 $.each(data, function( index, value ) {
 			// alert( index + ": " + JSON.stringify(value.WORKDATE) );
 		tr = $('<tr/>');
		
 		tr.append('<td>'+value.EMPLOYEENUMBER+'</td>');
 		tr.append('<td>'+value.CATSHOURS+'</td>');
 		tr.append('<td>'+value.WORKDATE+'</td>');
 		tr.append('<td>'+value.STARTTIME+'</td>');
 	 	tr.append('<td>'+value.ENDTIME+'</td>');
 		tr.append('<td>'+value.SHORTTEXT+'</td>');
 		$('.loading').hide();
 		$('.result').hide();
 		$('#tabell').append(tr); 
	   });
	}; 
	
	 //return false;
	   };
   });
};
form2.onsubmit = function(e) {
	   	e.preventDefault();
		console.log("Form2 submitt!");
   	 var message = {"profile":profile.value,"wdate":wdate.value,"empnr":empnr.value,"scctr":scctr.value, "stext":stext.value, "stime":stime.value, "etime":etime.value};
	 var url = '/sendTimeSheet';
	 $('#tabell').html('');
   	 $('.result').show();
   	 $('.loading').show();
	 var posting = $.post( url, { s: message } );	
	 posting.done(function( data ) {
		 
		 var data = JSON.parse(data)['CATimeSheetManager.Insert.Response']['Return']['item'];
		  console.log("got: "+ JSON.stringify(data));
   	 //ws.send(JSON.stringify(message));
	 
   	 $('.result').hide();
   	 $('.loading').hide();
	 if(data[0]){
		 $('#tabell').html("did it insert ?: "+data[0].MESSAGE);
 		}else{
 			$('#tabell').html("did it insert ?: "+data[0].MESSAGE);
 		};
	 
 	});
   	 return false;
	};
	
	$(function() {
	    $( "#fdate" ).datepicker({ dateFormat: 'yymmdd' });
	  });
  	$(function() {
  	    $( "#tdate" ).datepicker({ dateFormat: 'yymmdd' });
  	  });
  	$(function() {
  	    $( "#wdate" ).datepicker({ dateFormat: 'yymmdd' });
  	  });
	$(function(){
		$('#stime').timepicker({
			'minTime': '08:00',
    		'maxTime': '16:00',
    		'showDuration': false,
			'timeFormat': 'H:i:s'}
		);
	});
	$(function(){
		$('#etime').timepicker(
			{
			'minTime': '08:00',
			'maxTime': '16:00',
			'showDuration': false,
			'timeFormat': 'H:i:s'}
		);
	});  
	  
			
//	});		
	