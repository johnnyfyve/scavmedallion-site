<?php

  include "databaseConnection.php";

  $sql = $_REQUEST["x"];

  echo $sql . "\n<br>" . $mdbFilename . "\n<br>";

  $conn = odbc_connect("Driver={Microsoft Access Driver (*.mdb)};Dbq=" . $mdbFilename, "", "");
 
  $rs = odbc_exec($conn, $sql);

  if ($rs)
    echo "Success";
  else
    echo "Failed " . odbc_errormsg($conn);

  odbc_close($conn);

?>
