<html>
<head>
</head>
<body>

<?php

  include "./databaseConnection.php";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  $sql = "SELECT DISTINCT [entryID], "        .
                         "Day([Date]), "      .
                         "Month([Date]), "    .
                         "Year([Date]), "     .
                         "[Origin], "         .
                         "[Destination], "    .
                         "[Distance Flown], " .
                         "[Pilot], "          .
                         "[Passenger], "      .
                         "[Comments], "       .
                         "[Date] "            .
                    "FROM [trips Table] "      .
                   "WHERE [Valid]=true "      .
                     "AND [show]=True "       .
                "ORDER BY [Date] ";

  $rs = odbc_exec($conn, $sql);

  if ($rs)
    echo "Opened";

  while ($f = odbc_fetch_array($rs))
  {
    for ($i = 0; $i < count($f); $i++)
    {
      echo $i . " " . odbc_result($rs, $i+1) . "|";
    }
    echo "<br>\n";
  }
  odbc_close($conn);

?>

<HR>

<?php

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");
  $sql = "SELECT DISTINCT [entryID] FROM [trips Table]";
  $rs  = odbc_exec($conn, $sql);

  $summaryFlights = 0;
  while ($f = odbc_fetch_array($rs))
    $summaryFlights++;

  echo $summaryFlights;


  $sql = "SELECT DISTINCT [Origin] FROM [trips Table]";
  $rs  = odbc_exec($conn, $sql);
  $summaryAirports = 0;
  while ($f = odbc_fetch_array($rs))
    $summaryAirports++;
  echo "<br>" . $summaryAirports;

?>
<hr>
<?php

  $sql = "SELECT DISTINCT [EntryID], " .
                         "[Origin], " .
                         "[Destination], " .
                         "Day([Date]), " .
                         "Month([Date]), " .
                         "Year([Date]), " .
                         "[Date] " .
                    "FROM [trips Table] " .
                   "WHERE [Valid]=True " .
                "ORDER BY [Date] DESC, [EntryID] DESC";

  $rs  = odbc_exec($conn, $sql);
  echo "latest ";
  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . " " . odbc_result($rs, 2) . " " . date("d M Y", strtotime(odbc_result($rs, 7))) . "<br>";


?>
<hr>
<?php

  $sql = "SELECT DISTINCT [Origin] FROM [trips Table] " .
         "UNION " .
         "SELECT DISTINCT [Destination] FROM [trips Table] ";

  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . "<br>";

?>
<hr>
<?php

  echo "ID and State <br>";
  //$sql = "SELECT [ID], [State] FROM [Airports] WHERE [ID] IN (" .
  //         "SELECT DISTINCT [Origin] FROM [trips Table] " .
  //         "UNION " .
  //         "SELECT DISTINCT [Destination] FROM [trips Table] ) AS SUBQUERY";
  $sql = "SELECT DISTINCT Airports.State " .
                    "FROM trips Table " .
              "INNER JOIN Airports " .
                      "ON (trips Table.Origin = Airports.ID) " .
                      "OR (trips Table.Destination = Airports.ID)";

  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . "<br>";
         
?>
<hr>
<?php

  $sql = "SELECT DISTINCT  Airports.Lat, Airports.Lon, Airports.ID  " .
                    "FROM trips Table " .
              "INNER JOIN Airports ON (trips Table.Origin = Airports.ID) " .
              "        OR (trips Table.Destination = Airports.ID) ";
  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . " " . odbc_result($rs, 2) . " " . odbc_result($rs, 3). "<br>";


?>
<hr>
<?php


  $sql = "SELECT trips Table.[EntryID], trips Table.[Date], Airports.Lat, Airports.Lon, Airports.ID  " .
                    "FROM trips Table " .
              "INNER JOIN Airports ON (trips Table.Origin = Airports.ID) " .
              "        OR (trips Table.Destination = Airports.ID) " .
                   "WHERE [Valid]=True "   .
                     "AND [show]=True "   .

                 "ORDER BY [Date] DESC, [EntryID] DESC";
  $rs  = odbc_exec($conn, $sql);
  while ($f = odbc_fetch_array($rs))
    echo odbc_result($rs, 1) . " " . odbc_result($rs, 2) . " " . odbc_result($rs, 3). "<br>";


  odbc_close($conn);
?>







</body>
</html>