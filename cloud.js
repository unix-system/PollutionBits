var request = require('request');
var percent = 100;
var isTherePercent = false;
var isThereTime = false;
var time = 100;
var tepigUsed = false;
var squirtleUsed = false;
//var usedOnes = [];
//var deviceIds = ["00e04c0318ca","00e04c035a67","00e04c037b69"];
var accessToken = "db1a5b0a254dc532fd2d7265b8d758c8c4c03ed62220ab5d1daec47fdd9b9057";
var locationNameSlugs = ['guildhall','londonrdenc','londonrdaurn'];
var tepig = '00e04c2241e8';//'00e04c0318ca';
var squirtle = '00e04c035a67';
var bulbasaur = '00e04c037b69';
var averagecount = 0;
var averagenums = 0;

function getDataFromBathHacked(loc){
  //my cloudbit

  //set up request to send.
  var options = {
    method: "GET",
    url: 'https://data.bathhacked.org/resource/hqr9-djir.json?sensor_location_slug='+loc+'&$limit=5&$order=datetime%20desc'
    };


    //completion function
    function callback(error, response, body) {
      var data = JSON.parse(body);
      if (!error && response.statusCode == 200 ) {
        //console.log('SUCCESS! IT READS: '+JSON.stringify(body));
        console.log(data[0].nox);
        console.log(data[0].sensor_location_slug);

        averagecount = averagecount + 1;
        averagenums = averagenums + parseInt(data[0].nox);

        if (data[0].sensor_location_slug == "londonrdaurn") {
          //update tepig
          console.log('SENDING TO FAKE Tepig (Oshawatt)');
          sendReqToClouds(tepig,accessToken,'Tepig',data[0].nox, true);

        } else if (data[0].sensor_location_slug == "guildhall") {
          //update squirtle
          console.log('SENDING TO Squirtle');
          sendReqToClouds(squirtle,accessToken,'Squirtle',data[0].nox, true);

      }

console.log("averages x=" + averagenums);

        if (averagecount == locationNameSlugs.length) {
          //we now have all our averages
          sendReqToClouds(bulbasaur,accessToken,'Bulbasaur',averagenums/averagecount,false);
          console.log("averages=" + averagenums);
        }


        }
      }
      request(options, callback);
    }


    //send request.

















//get requests for both guildhall and windsorbridge
averages = 0;
for(var i in locationNameSlugs) {
    getDataFromBathHacked(locationNameSlugs[i]);
}

sendReqToClouds(bulbasaur,accessToken,'Bulbasaur',0,true);




// Max's code :3
function sendReqToClouds(locdeviceid,locaccesstoken,devicename,noxval, needsAmmendingForBarGraphs){

var noxvalfin = noxval;
//var noxvalfin = (noxvalfin/100)*150;

// if (needsAmmendingForBarGraphs) {
   var noxvalfin = (noxvalfin/100)*150;
  //  console.log('test: '+noxvalfin);
 //}
 if (noxvalfin>=1000000) {
   noxvalfin = 0;
 }
 if(noxvalfin >= 100){
   //console.log('yes it is');
   noxvalfin = 100;
 }
  //console.log(noxvalfin);
//  console.log(timeval);
// if(devicename == "Bulbasaur") {
//   console.log('YES I WORK');
//   var options = {
//   method: "POST",
//   url: 'https://api-http.littlebitscloud.cc/v2/devices/'+locdeviceid+'/output',
//   body: JSON.stringify({
//    "percent":parseInt(totalavg),
//    "duration_ms":-1 }),
//    headers: {
//      'Content-Type': 'application/json',
//    'Authorization': 'Bearer ' + locaccesstoken
//    }
//   };
//
// } else {
  var options = {
  method: "POST",
  url: 'https://api-http.littlebitscloud.cc/v2/devices/'+locdeviceid+'/output',
  body: JSON.stringify({
    "percent":noxvalfin,
    "duration_ms":-1 }),
    headers: {
      'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + locaccesstoken
    }
  };
//}
  function callback(error, response, body) {

  if (!error && response.statusCode == 200) {
  console.log(devicename+": SUCCESS! SENT TO CLOUD WITH JASON SAYING: "+JSON.stringify(body)+" (SET IT TO GO TO "+noxvalfin+"%)"); //THERE WAS A THINGY
      } else {
  console.log(devicename+": ERROR! JASON SAYS: "+JSON.stringify(error)+'"'+", WITH RESPONSE: "+JSON.stringify(response)+'" AND THE BODY SAYING: '+JSON.stringify(body));//THERE WAS AN ERROR THINGY THAT IDK
    }

  }

     request(options, callback); //V. IMPORTANT
}
