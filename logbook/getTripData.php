<?php

  include "databaseConnection.php";

  $v = $_REQUEST["v"];

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");

  $sql = "SELECT DISTINCT [entryID], "        .
                         "[Date], "           .
                         "[Origin], "         .
                         "[Destination], "    .
                         "[Distance Flown], " .
                         "[Pilot], "          .
                         "[Passenger], "      .
                         "[Comments], "       .
                         "[Valid], "          .
                         "[show] "            .
                    "FROM [tripsTable] ";//

  if ($v == 1)
    $sql = $sql . "WHERE [Valid]=True AND [show]=True ";

  $sql = $sql . "ORDER BY [Date] DESC";

  $rs = odbc_exec($conn, $sql);

  while ($f = odbc_fetch_array($rs))
  {
    for ($i = 0; $i < count($f); $i++)
    {
      if ($i == 1)
        echo date("d M Y", strtotime(odbc_result($rs, $i + 1))) . "|";
      else
        echo odbc_result($rs, $i + 1) . "|";
    }
    echo "<br>\n";
  }
  odbc_close($conn);

?>
