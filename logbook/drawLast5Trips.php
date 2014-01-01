<?php
  include "databaseConnection.php";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  // Flights
  $sql = "SELECT tripsTable.[EntryID], tripsTable.[Date], Airports.Lat, Airports.Lon, Airports.ID  " .
                    "FROM tripsTable " .
              "INNER JOIN Airports ON (tripsTable.Origin = Airports.ID) " .
              "        OR (tripsTable.Destination = Airports.ID) " .
                   "WHERE [Valid]=True "   .
                     "AND [show]=True "   .
                "ORDER BY [Date] DESC, [EntryID] DESC";

  $rs  = odbc_exec($conn, $sql);

  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . " " . odbc_result($rs, 3) . " " . odbc_result($rs,4). "\n";

  odbc_close($conn);
?>
