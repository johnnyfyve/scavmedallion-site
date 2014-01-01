<?php
  include "databaseConnection.php";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  // Flights
  $sql = "SELECT DISTINCT  Airports.Lat, Airports.Lon, Airports.ID  " .
                    "FROM [trips Table] " .
              "INNER JOIN Airports ON (tripsTable.Origin = Airports.ID) " .
              "        OR (tripsTable.Destination = Airports.ID) ";
  $rs  = odbc_exec($conn, $sql);

  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . " " . odbc_result($rs, 2) . " " . odbc_result($rs, 3). "\n";

  odbc_close($conn);
?>
