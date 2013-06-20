<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta charset="utf-8" />
    <title>AS3 to TypeScript Convertor by Richard Davey</title>
    <link href='http://fonts.googleapis.com/css?family=Source+Code+Pro:400,700' rel='stylesheet' type='text/css'>
    <style>
        body {
            font-family: 'Source Code Pro', sans-serif;
            color: #ffffff;
            margin: 24px;
            background-color: #1f7e9d;
        }

        h1, h2, h3 {
            text-shadow: 0 1px 0 #424242;
            font-weight: normal;
            padding: 0;
        }

        div#header {
            background: url(http://sandbox.photonstorm.com/gfx/burd-64x64.png) no-repeat top right;
            min-height: 64px;
            margin-bottom: 32px;
        }

        div#header h1 {
            float: left;
            margin: 10px 0px 0px 0px;
        }

        div#header h3 {
            float: right;
            margin: 10px 80px 0px 0px;
        }

        a {
            text-decoration: none;
            color: #fff568;
        }

        a:hover {
            background-color: #FF9900;
            color: #000;
        }

        div#filelist {
            font-size: 10pt;
        }
    </style>
</head>
<body>

<div id="header">
    <h1>AS3 to TypeScript Convertor</h1>
    <h3>v1.1 - Richard Davey<br /><a href="http://www.photonstorm.com">Photon Storm</a></h3>
</div>

<?php
    $input_dir = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'input';
    $output_dir = dirname(__FILE__) . DIRECTORY_SEPARATOR . 'output';

    //  The results are saved into the global var $filelist
    $filelist = array();

    if (is_dir($input_dir))
    {
        //  Deep scan for .as files
        dirToArray($input_dir);

        // print_r($filelist);  //  Uncomment for debugging
    }

    $all_files = false;
    $single_file = false;
    $total = count($filelist);

    if (isset($_GET['f']) === true)
    {
        $single_file = $_GET['f'];
    }

    if (isset($_GET['a']) === true)
    {
        $all_files = true;
    }

    //  Display the output
    if ($total > 0)
    {
        if ($all_files === false && $single_file === false)
        {
            displayFileTotal();
            displayFileList();
        }
        else if ($single_file !== false)
        {
            displaySingleFile($single_file);
            processFile($single_file, false);
            displaySummary();
        }
        else if ($all_files !== false)
        {
            displayFileTotal();

            foreach ($filelist as $key => $value) {
                processFile($value, true);
            }
    
            displaySummary();
        }
    }
    else
    {
        displayNoFilesFound();
    }

    function displayNoFilesFound() {

        global $input_dir;

        echo "<p>No ActionScript files found in $input_dir or folder doesn't exist.</p>";
        echo "<p>Please copy some across and <a href=\"index.php\">refresh this page</a>.</p>";

    }

    function displayFileTotal() {

        global $total, $input_dir;

        echo "<p>$total ActionScript files found in $input_dir</p>";

    }

    function displaySingleFile($filename) {

        $filename = substr($filename, strrpos($filename, DIRECTORY_SEPARATOR) + 1);

        echo "<h2>Processing $filename</h2>";

    }

    function displayFileList() {

        global $filelist;

        echo "<h2>File List</h2>";
        echo "<p>You can either <a href=\"index.php?a=1\">convert all files</a> at once or select a single file from the list below.</p>";
        echo "<div id=\"filelist\">";

        foreach ($filelist as $key => $value) {
            echo "<a href=\"index.php?f=$value\">$value</a><br />";
        }

        echo "</div>";

    }

    function displaySummary() {

        echo "<h2>Conversion complete</h2>";
        echo "<p>Please be under no illusion about the amount of work you now need to do, such as injecting '.this' everywhere.<br />";
        echo "But at least a large part of the grunt work is out of the way.</p>";
        echo "<p>Go forth and compile! and feel free to join us on the <a href=\"http://www.html5gamedevs.com\">HTML5 Game Devs.com</a> Forum</p>";
        echo "<p><a href=\"index.php\">Back to file list</a></p>";

    }

    function dirToArray($dir) { 

        global $filelist;

        $ignore = array('.', '..', '.svn', '.git', 'index.php');
        $root = scandir($dir); 
        $files = array_diff($root, $ignore);

        foreach ($files as $key => $value)
        {
            if (is_dir($dir . DIRECTORY_SEPARATOR . $value))
            {
                dirToArray($dir . DIRECTORY_SEPARATOR . $value);
            }
            else
            {
                if (substr($value, -3) == '.as')
                {
                    $filelist[] = $dir . DIRECTORY_SEPARATOR . $value;
                }
            }
        }
    } 

    //  Process the ActionScript file and convert the most obvious things over to TypeScript ES5.
    //  Be under no illusion - you'll need to tidy up a LOT by hand (injecting this. everywhere for example), but it
    //  will get a load of the grunt work out of the way at least.
    //  If you create extra useful checks (or fix/extend those in place below) please send them to me (rdavey@gmail.com)
    function processFile($full_file, $short) {

        global $input_dir, $output_dir;

        $dir = dirname($full_file);
        $filename = basename($full_file);

        $new_dir = str_replace($input_dir, $output_dir, $dir);
        $new_filename = str_replace('.as', '.ts', $filename);
        $output_file = $new_dir . DIRECTORY_SEPARATOR . $new_filename;

        //  Now process the file and save the new one
        $output = file_get_contents($full_file);

        $classname = '';
        $vars = array();
        $consts = array();

        //  Try and work out the class name
        $class = preg_match('/public class (\w*)/i', $output, $matches);

        if ($class)
        {
            $classname = trim($matches[1]);
        }

        //  Scan for class level variables
        $vars_check = preg_match_all('/(public|private|protected|internal) var (\w*)/i', $output, $matches);

        if ($vars_check)
        {
            // print_r($matches);
            $vars = $matches[2];
        }

        //  Scan for consts
        $consts_check = preg_match_all('/const (\w*)/i', $output, $matches);

        if ($consts_check)
        {
            // print_r($matches);
            $consts = $matches[1];
        }

        //  #1 - Boolean to bool
        $output = str_replace(':Boolean', ':bool', $output);

        //  #2 - uint to number
        $output = str_replace(':uint', ':number', $output);

        //  #3 - int to number
        $output = str_replace(':int', ':number', $output);

        //  #4 - Number to number
        $output = str_replace(':Number', ':number', $output);

        //  #5 - remove :void
        $output = str_replace(':void', '', $output);

        //  #6 - rename package to module
        $output = str_replace('package', 'module', $output);

        //  #7 - public class to class
        $output = str_replace('public class', 'export class', $output);

        //  #8 - comment out import statements
        $output = str_replace('import', '//import', $output);

        //  #9 - 'internal var' to 'private' (as close as TS gets, but often incorrect)
        $output = str_replace('internal var ', 'private ', $output);

        //  #10 - swap static order
        $output = str_replace('static public', 'public static', $output);
        $output = str_replace('static private', 'private static', $output);

        //  #11 - append class name in front of consts
        foreach ($consts as $key => $value) {
            $output = str_replace($value, "$classname.$value", $output);
        }

        //  Remove the const keyword
        $output = str_replace("const $classname.", '', $output);

        //  #12 - 'protected var' to 'private' (as close as TS gets, but often incorrect)
        $output = str_replace('protected var ', 'private ', $output);

        //  #13 - 'public var' to 'public'
        $output = str_replace('public var ', 'public ', $output);

        //  #14 - public function
        $output = str_replace('public function ', 'public ', $output);

        //  #15 - private function
        $output = str_replace('private function ', 'private ', $output);

        //  #16 - internal function
        $output = str_replace('internal function ', 'private ', $output);

        //  #17 - override public function
        $output = str_replace('override public ', 'public ', $output);

        //  #18 - constructor swap
        if ($classname !== '')
        {
            $output = str_replace("public $classname", 'constructor', $output);
        }

        //  #19 - remove :Array
        $output = str_replace(':Array', '', $output);

        //  #20 - remove :Function
        $output = str_replace(':Function', '', $output);

        //  #21 - String to string
        $output = str_replace(':String', 'string', $output);

        //  #22 - new Array() to []
        $output = str_replace('new Array()', '[]', $output);

        //  #23 - public static function
        $output = str_replace('public static function', 'public static', $output);

        //  #24 - remove :Class
        $output = str_replace(':Class', '', $output);

        //  TODO - Append 'this.' before all class level vars.
        //  It needs a way of alsl picking up vars defined from an extended class
        //  It also needs a way of matching
        // foreach ($vars as $key => $value) {
        //     $output = str_replace($value, "this.$value", $output);
        // }

        //  Save file

        //  If the folder doesn't exist, create it ...
        if (is_dir($new_dir) === false)
        {
            mkdir($new_dir, 0777, true);
        }

        //  Write the output
        $save_result = file_put_contents($output_file, $output);

        if ($save_result === false)
        {
            echo "Error writing file to $output_file - please check httpd write permissions.<br />";
        }
        else
        {
            if ($short === true)
            {
                echo "Saved $output_file<br />";
            }
            else
            {
                echo "<textarea style=\"width: 1000px; height: 600px\">";
                echo $output;
                echo "</textarea>";

                echo "<h3>Class level consts</h3>";
                echo "<textarea style=\"width: 1000px; height: 200px\">";
                foreach ($consts as $key => $value) {
                    echo "$value\n";
                }
                echo "</textarea>";

                echo "<h3>Class level properties (not including inherited)</h3>";
                echo "<textarea style=\"width: 1000px; height: 200px\">";
                foreach ($vars as $key => $value) {
                    echo "$value\n";
                }
                echo "</textarea>";

                echo "<p>Saved to $output_file</p>";
            }
        }
    }
?>

</body>
</html>