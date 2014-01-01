months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
flightListFields  = ["date", "origin", "dest", "dur", "pilot", "comment"];
flightListFNumber = [ 1,      2,        3,      4,     5,       7];


function parseLine(s, d, x)
{
  parseLine(s, d, x, false);
}


/********************************************************************
 parseLine(s, d, x)
  s = string to parse
  d = delimiter character
  x = which element
  indexes start at 0, meaning element 0 is the first element. start
  array counters at 0.. look for the next occurrance of the delimiter. 
 ********************************************************************/
function parseLine(s, d, x, debug)
{
  if (debug)
    alert ("DEBUGGING");

  count    = 0;
  startPos = 0;
  thisWord = "filler";

  if (x == 0)
  {
    endPos = s.indexOf(d);
    if (endPos == -1)
      endPos = s.length;
    thisWord = s.substring(startPos, endPos);
  }
  else
  {
    while ((count < (x + 1)) && (startPos > -1))
    {
      endPos = s.indexOf(d, startPos);
      if (endPos < 0)
      {
        endPos = s.length;
        //alert ("At the end");
      }

      thisWord = s.substring(startPos, endPos);
      if (debug)
        alert ("s: " + s + "\nx: " + x + "\ncount: " + count + "\nstartPos: " + startPos + "\nendPos: " + endPos + "\nthisWord: " + thisWord);
      startPos = endPos + 1;
      count++;
      //alert (startPos + "\n" + endPos);
    }
    if (debug)
      alert ("count:" + count + "\nx: " + x + "\nword:" + thisWord);
    if (count != x +1)
    {
      //alert("Not found");
      thisWord = "";
    }
  }
  return (thisWord);
}

/*****************************************************************
  updateFlights()
 *****************************************************************/
function updateFlights()
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "getTripData.php", false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 
  //document.getElementById("statusCell").innerHTML = answer;

  clearFlightData();

  answerArray = answer.split("\n");
  //alert ("Number of answers " + answerArray.length);
  for (row = 0; row < 5; row++)
  {
    if (row < answerArray.length - 1)
      fillFlightDataList(answerArray[row], row);
  }
}

/*****************************************************************
  clearFlightData()
  erase all the infomration in the table
 *****************************************************************/
function clearFlightData()
{
  //alert("Clearing");
  for (i = 0; i < 5; i++)
  {
    for (field = 0; field < flightListFields.length; field++)
    {
      colName = flightListFields[field] + i;
      document.getElementById(colName).innerHTML = "";
    }
  }
}

/*****************************************************************
  fillFlightDataList(s, rownumber)
 *****************************************************************/
function fillFlightDataList(s, row)
{
  for (field = 0; field < flightListFields.length; field++)
  {
    colName = flightListFields[field] + row;
    dataElement = parseLine(s, "|", flightListFNumber[field]);

    document.getElementById(colName).innerHTML = dataElement;
  }
}


/*****************************************************************
  updateSummary()
 *****************************************************************/
function updateSummary()
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "updateSummary.php", false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 
  //alert ("Summary: " + answer);

  document.getElementById("summaryFlightCount" ).innerHTML = parseLine(answer, "|", 0);
  document.getElementById("summaryMiles"       ).innerHTML = parseLine(answer, "|", 1);
  document.getElementById("summaryAirportCount").innerHTML = parseLine(answer, "|", 2);
  document.getElementById("summaryCountryCount").innerHTML = parseLine(answer, "|", 3);
  document.getElementById("summaryStateCount"  ).innerHTML = parseLine(answer, "|", 4);
  document.getElementById("summaryPilotCount"  ).innerHTML = parseLine(answer, "|", 5);

  document.getElementById("latestFltOrigin").innerHTML = parseLine(answer, "|", 6);
  document.getElementById("latestFltDest"  ).innerHTML = parseLine(answer, "|", 7);
  document.getElementById("latestFltPilot" ).innerHTML = parseLine(answer, "|", 8);
  document.getElementById("latestFltDate"  ).innerHTML = parseLine(answer, "|", 9);

}


/*****************************************************************
  updateMap()
 *****************************************************************/
function updateMap()
{
  updateMapMarkers();
  drawLast5Flights();
}


/*****************************************************************
  updateMapMarkers()
 *****************************************************************/
function updateMapMarkers()
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "updateMap.php", false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 

  answerArray = answer.split("\n");

  var mapMarkerIcon = "./pictures/SCAM Map Marker Icon.png";

  for (i = 0; i < answerArray.length - 1; i++)
  {
    //alert (parseLine(answerArray[i], " ", 0) + "\n" +
    //       parseLine(answerArray[i], " ", 1));

    var myLatlng  = new google.maps.LatLng(parseLine(answerArray[i], " ", 0),
                                           parseLine(answerArray[i], " ", 1));
    var marker = new google.maps.Marker({
                                         position: myLatlng,
                                         map: map,
                                         title: parseLine(answerArray[i], " ", 2)//,
                                         //icon: mapMarkerIcon
                                        });
  }
}

/*****************************************************************
  drawLast5Flights()
 *****************************************************************/
function drawLast5Flights()
{
  var mymap = document.getElementById("map-canvas");
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "drawLast5Trips.php", false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 

  answerArray = answer.split("\n");
  //alert (answer);
  
  //alert (answerArray.length);

  for (i = 0; i < Math.min(answerArray.length - 1, 10); i = i + 2)
  {
    lat1 = parseLine(answerArray[i], " ", 1);
    lon1 = parseLine(answerArray[i], " ", 2);
    lat2 = parseLine(answerArray[i+1], " ", 1);
    lon2 = parseLine(answerArray[i+1], " ", 2);

    //alert (parseLine(answerArray[i], " ", 0) + "\n" + parseLine(answerArray[i], " ", 1));

    tripCoords = [new google.maps.LatLng(lat1, lon1),
                  new google.maps.LatLng(lat2, lon2)  ];

    var lineSymbol = {
                       path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
                     };


    var tripPath = new google.maps.Polyline({
                                             path: tripCoords ,
                                             icons: [{
                                                      icon: lineSymbol,
                                                      offset: '100%'
                                                     }],
                                             strokeColor: '#FF0000',
                                             strokeOpacity: 1.0,
                                             strokeWeight: 2
                                            });
    tripPath.setMap(map);
  }


}




