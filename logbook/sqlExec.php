<?php

  include "databaseConnection.php";

  $sql = $_REQUEST["x"];

  //echo $sql . "\n<br>" . $mdbFilename . "\n<br>";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");
 
  $rs = odbc_exec($conn, $sql);

  if ($rs)
  {
    if (substr($sql, 0, 6) == "SELECT")
    {
      while ($f = odbc_fetch_array($rs))
      {
        for ($i = 0; $i < count($f); $i++)
        {
          echo odbc_result($rs, $i + 1) . "|";
        }
        echo "<br>\n";
      }
    }
    else
      echo "Success";
  }
  else
    echo "Failed " . odbc_errormsg($conn);

  odbc_close($conn);

?>
