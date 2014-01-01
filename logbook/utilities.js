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
        alert ("s: " + s + "\nx: "        + x        +
                           "\ncount: "    + count    +
                           "\nstartPos: " + startPos +
                           "\nendPos: "   + endPos   +
                           "\nthisWord: " + thisWord );
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
function updateFlights(onlyValids)
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "getTripData.php?v=1", false);
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
    lat1 = parseLine(answerArray[i],     " ", 1);
    lon1 = parseLine(answerArray[i],     " ", 2);
    lat2 = parseLine(answerArray[i + 1], " ", 1);
    lon2 = parseLine(answerArray[i + 1], " ", 2);

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
                                             strokeWeight: 3
                                            });
    tripPath.setMap(map);
  }
}

/*****************************************************************
  submitNewFlight()
 *****************************************************************/
function submitNewFlight()
{
  //alert ("Submit");
  fltDate  = document.getElementById("newDate"   ).value;
  origin   = document.getElementById("newOrigin" ).value;
  dest     = document.getElementById("newDest"   ).value;
  distance = document.getElementById("newDist"   ).value;
  pilot    = document.getElementById("newPilot"  ).value;
  comment  = document.getElementById("newComment").value;

  if (origin   != "" &&
      dest     != "" &&
      distance != "" &&
      pilot    != "" &&
      comment  != "")
  {
    sSQL = "INSERT INTO [tripsTable] "       +
                      "([Date],"             +
                      " [Origin],"           +
                      " [Destination],"      +
                      " [Distance Flown],"   +
                      " [Pilot],"            + 
                      " [Comments])"         +
               " VALUES (#" + fltDate  + "#, " +
                        "'" + origin   + "', " +
                        "'" + dest     + "', " +
                              distance + ", "  +
                        "'" + pilot    + "', " +
                        "'" + comment  + "')";
    //alert (sSQL);

    xmlhttp = new XMLHttpRequest();
    xmlhttp.open("GET", "insertNewFlight.php?x=" + sSQL, false);
    xmlhttp.send();
    answer = xmlhttp.responseText; 

    //document.getElementById("statusCell").innerHTML = answer;
    //alert ("answer back :" + answer);  

    alert ("Thank you for your submission.\n" +
           "All flights are subject to review before\n" +
           "being posted.");
    document.getElementById("newDate"   ).value = "";
    document.getElementById("newOrigin" ).value = "";
    document.getElementById("newDest"   ).value = "";
    document.getElementById("newDist"   ).value = "";
    document.getElementById("newPilot"  ).value = "";
    document.getElementById("newComment").value = "";
  }
  else
  {
    alert ("All fields must contain data");
  }
}


/*****************************************************************
  fixCase()
 *****************************************************************/
function fixCase(reference)
{
  t = document.getElementById(reference.id).value;
  t1 = t.toUpperCase();
  document.getElementById(reference.id).value = t1;
  checkForOrigDest();
}

/*****************************************************************
  checkForOrigDest()
 *****************************************************************/
function checkForOrigDest()
{
  o = document.getElementById("newOrigin").value;
  d = document.getElementById("newDest"  ).value;

  if (o != "" && d != "")
  {
    sSQL = "SELECT [Lat], [Lon] FROM [Airports] WHERE [ID]='" + o + "'";
    oLatLon = phpexecSQL(sSQL);

    sSQL = "SELECT [Lat], [Lon] FROM [Airports] WHERE [ID]='" + d + "'";
    dLatLon = phpexecSQL(sSQL);

    lat1 = parseLine(oLatLon, "|", 0);
    lon1 = parseLine(oLatLon, "|", 1);
    lat2 = parseLine(dLatLon, "|", 0);
    lon2 = parseLine(dLatLon, "|", 1);

    if (lat1 != "" && lat2 != "" && lon1 != "" && lon2 != "")
    {
      myDist = computeGCdistance(lat1, lon1, lat2, lon2);
      document.getElementById("newDist").value = myDist;
    }
  }
}


/*****************************************************************
  clearTable()
 *****************************************************************/
function clearTable()
{
  t = document.getElementById("flightTable");
  r = t.rows.length - 2;   // save the two header lines in the table

  for (i = 0; i < r; i++)
    t.deleteRow(-1);
}


/*****************************************************************
  getFltsForApproval()
 *****************************************************************/
function getFltsForApproval()
{
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "getTripData.php?v=0", false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 
  answerArray = answer.split("\n");

  //document.getElementById("statusCell").innerHTML = answer;
  //alert ("answer back : " + answerArray.length + "\n" + answer);  
  
  t = document.getElementById("flightTable");

  for (i = 0; i < answerArray.length - 1; i++)
  {
    r = t.insertRow();
    r.id = "row" + parseLine(answerArray[i], "|", 0);
    for (j = 0; j < 10; j++)
    {
      c = r.insertCell();
      content = "";
      itschecked = "";
      rowColor = "lightgray";
      switch (j)
      {
        case 8:
          x = parseLine(answerArray[i], "|", j);
          if (x == "1")
          {
            rowColor = "red";
            itschecked = " checked ";
          }
          content = "<input type=checkbox id=valid" + parseLine(answerArray[i], "|", 0) +
                       itschecked + " onclick=\"updateValids(this)\">";
          break;
        case 9:
          x = parseLine(answerArray[i], "|", j);
          if (x == "1")
          {
            itschecked = " checked ";
            rowColor = "";
          }
          content = "<input type=checkbox id=show" + parseLine(answerArray[i], "|", 0) +
                       itschecked + " onclick=\"updateShows(this)\">";
          break;
        default:
          content = parseLine(answerArray[i], "|", j);
          //rowColor = "";
          break;
      }
      c.innerHTML = content;
      c.className = "fltslistC";
    }

    checkRowColor(parseLine(answerArray[i], "|", 0));
    //r.style.background = rowColor;
  }
}


/*****************************************************************
  checkRowColor(rowID)
 *****************************************************************/
function checkRowColor(rowID)
{
  bgcolor = "";
  v = document.getElementById("valid" + rowID).checked;
  s = document.getElementById("show" + rowID).checked;
  if (!v || !s)
    bgcolor = "lightgray";

  document.getElementById("row" + rowID).style.background = bgcolor;
}


/*****************************************************************
  updateValids(rowID)
 *****************************************************************/
function updateValids(rowID)
{
  mybgcolor = "";
  v = document.getElementById(rowID.id).checked;
  sSQL = "UPDATE [tripsTable] SET [Valid]=" + v + " WHERE [entryID]=" + rowID.id.substring(5);
  r = phpexecSQL(sSQL);
  if (r == "Success")
    checkRowColor(rowID.id.substring(5));
}


/*****************************************************************
  updateShows(rowID)
 *****************************************************************/
function updateShows(rowID)
{
  v = document.getElementById(rowID.id).checked;
  sSQL = "UPDATE [tripsTable] SET [show]=" + v + " WHERE [entryID]=" + rowID.id.substring(4);
  r = phpexecSQL(sSQL);
  if (r == "Success")
    checkRowColor(rowID.id.substring(4));
}


/*****************************************************************
  phpexecSQL(s)
 *****************************************************************/
function phpexecSQL(s)
{
  //alert (s);
  xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", "sqlExec.php?x=" + s, false);
  xmlhttp.send();
  answer = xmlhttp.responseText; 
  return (answer);
}


/*****************************************************************
  computeGCdistance()
 *****************************************************************/
function computeGCdistance(lat1, lon1, lat2, lon2)
{
  lt1r = lat1 * Math.PI / 180.0;
  lt2r = lat2 * Math.PI / 180.0;
  ln1r = lon1 * Math.PI / 180.0;
  ln2r = lon2 * Math.PI / 180.0;

  distance = Math.round(180.0 * 60.0 / Math.PI * Math.acos(Math.sin(lt1r) * Math.sin(lt2r) +
                         Math.cos(lt1r) * Math.cos(lt2r) * Math.cos(ln1r - ln2r)));
  return (distance);  
}




