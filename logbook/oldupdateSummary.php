<?php
  include "databaseConnection.php";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  /********************************************************************
    Flights
    Miles
   ********************************************************************/
  $sql = "SELECT DISTINCT [entryID], "       .
                         "[Distance Flown] " .
                    "FROM [trips Table] "     .
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
  $sql = "SELECT DISTINCT [Origin] FROM [trips Table] WHERE [Valid]=True " .
         "UNION " .
         "SELECT DISTINCT [Destination] FROM [trips Table] WHERE [Valid]=True ";
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
                    "FROM trips Table " .
              "INNER JOIN Airports " .
                      "ON (trips Table.Origin = Airports.ID) " .
                      "OR (trips Table.Destination = Airports.ID)";

  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    $summaryStates++;

  /********************************************************************
    Pilots
   ********************************************************************/
  $sql = "SELECT DISTINCT [Pilot] FROM [trips Table]" .
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
                    "FROM [trips Table] "   .
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
