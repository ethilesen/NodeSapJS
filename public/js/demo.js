

'use strict';





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
  var scctr = document.getElementById('stime');
  var scctr = document.getElementById('etime'); 
  var messagesList = document.getElementById('messages');

form.onsubmit = function(e) {
	e.preventDefault();
  $('html, body').animate({
		        scrollTop: $("#messages").offset().top
		    }, 2000);
// Retrieve the message from form submitt.
	 var message = {"qtype":"glist","fdate":fdate.value,"tdate":tdate.value,"empnrf":empnrf.value,"empnrt":empnrt.value};
	 var url = '/GetTimeSheet';
	  $('#tabell').html('');
   	 $('.result').show();
   	 $('.loading').show();
	 var posting = $.post( url, { s: message } );
	 posting.done(function( data ) {
		 console.log("got: "+ data);

 		if (data.lastIndexOf('{"CATimeSheetRecord.GetList.Response"', 0) === 0){
    try{
 		var data = JSON.parse(data)['CATimeSheetRecord.GetList.Response']['CatsrecordsOut']['item'];
 		//$('#messages').html(JSON.stringify(data));
   }
   catch(err){
		console.log(JSON.stringify(data));
  }
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
 } // if data lastIndexOf
 else {

    $('.result').hide();
    $('.loading').hide();
    $('#tabell').html("Obs.... something went wrong" + JSON.stringify(data) );
 }
     // response does not contanin any array...

   }); // posting done...

} // form 1
form2.onsubmit = function(e) {
	   	e.preventDefault();
       $('html, body').animate({
		        scrollTop: $("#messages").offset().top
		    }, 2000);
		console.log("Form2 submitt!");
   	 var message = {"profile":profile.value,"wdate":wdate.value,"empnr":empnr.value,"scctr":scctr.value, "stext":stext.value, "stime":stime.value, "etime":etime.value};
	 var url = '/sendTimeSheet';
	 $('#tabell').html('');
   	 $('.result').show();
   	 $('.loading').show();
	 var posting = $.post( url, { s: message } );
	 posting.done(function( data ) {

    console.log("got: "+ data);
    $('#tabell').html("Obs.... something went wrong" + JSON.stringify(data));




   	 $('.result').hide();
   	 $('.loading').hide();

		 $('#tabell').html("Return Message: "+data);
 		

 	});
   	 return false;
	};
	$(function() {
	    $( "#fdate" ).datepicker({ dateFormat: 'yymmdd' });
			$( "#tdate" ).datepicker({ dateFormat: 'yymmdd' });
			$( "#wdate" ).datepicker({ dateFormat: 'yymmdd' });
			$('#stime').timepicker({'minTime': '08:00','maxTime': '16:00','showDuration': false,'timeFormat': 'H:i:s'});
			$('#etime').timepicker({'minTime': '08:00','maxTime': '16:00','showDuration': false,'timeFormat': 'H:i:s'});
	  });
