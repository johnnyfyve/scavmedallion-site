<?php
  include "databaseConnection.php";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  /********************************************************************
    Flights
    Miles
   ********************************************************************/
  $sql = "SELECT DISTINCT [entryID], "       .
                         "[Distance Flown] " .
                    "FROM [tripsTable] "     .
                   "WHERE [Valid]=True ";
  $rs  = odbc_exec($conn, $sql);

  $summaryFlights = 0;
  $summaryMiles   = 0;

  while ($f = odbc_fetch_array($rs))
  {
    $summaryFlights++;
    $summaryMiles += odbc_result($rs, 2);
  }
  
  /********************************************************************
    Airports
   ********************************************************************/
  $sql = "SELECT DISTINCT [Origin] FROM [tripsTable] WHERE [Valid]=True " .
         "UNION " .
         "SELECT DISTINCT [Destination] FROM [tripsTable] WHERE [Valid]=True ";
  $rs  = odbc_exec($conn, $sql);
  $summaryAirports = 0;
  while ($f = odbc_fetch_array($rs))
    $summaryAirports++;

  /********************************************************************
    Countries
   ********************************************************************/
  $summaryCountries = 1;  

  /********************************************************************
    States
   ********************************************************************/
  $sql = "SELECT DISTINCT Airports.State " .
                    "FROM tripsTable " .
              "INNER JOIN Airports " .
                      "ON (tripsTable.Origin = Airports.ID) " .
                      "OR (tripsTable.Destination = Airports.ID)";

  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    $summaryStates++;

  /********************************************************************
    Pilots
   ********************************************************************/
  $sql = "SELECT DISTINCT [Pilot] FROM [tripsTable]" .
                   "WHERE [Valid]=True ";
  $rs  = odbc_exec($conn, $sql);
  $summaryPilots = 0;
  while ($f = odbc_fetch_array($rs))
    $summaryPilots++;

  /********************************************************************
    Latest Flight
   ********************************************************************/
  $sql = "SELECT DISTINCT [EntryID], "     .
                         "[Origin], "      .
                         "[Destination], " .
                         "[Pilot], "       .
                         "[Date] "         .
                    "FROM [tripsTable] "   .
                   "WHERE [Valid]=True "   .
                "ORDER BY [Date] DESC, "   .
                         "[EntryID] DESC";

  $rs  = odbc_exec($conn, $sql);
  $latestFlight = odbc_result($rs, 2) . "|" .
                  odbc_result($rs, 3) . "|" .
                  odbc_result($rs, 4) . "|" .
                  date("d M Y", strtotime(odbc_result($rs, 5)));

  odbc_close($conn);

  echo $summaryFlights   . "|" .
       $summaryMiles     . "|" .
       $summaryAirports  . "|" .
       $summaryCountries . "|" .
       $summaryStates    . "|" .
       $summaryPilots    . "|" .
       $latestFlight;
?>
