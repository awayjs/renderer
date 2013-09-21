<?php

    $fname      = $_POST['fname'];
    $lname      = $_POST['lname'];

    if( isset( $lname )) {

        $myFile     = "data.txt";
        $fh         = fopen($myFile, 'a') or die("can't open file");
        $stringData = $fname . '|' . $lname . "\n";

        fwrite($fh, $stringData);
        fclose($fh);

		echo( 'success=true');

    } else {

    	echo( 'success=false');

    }

?>