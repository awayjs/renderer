AS3 To TypeScript Convertor
===========================

Version 1.1

April 2nd 2013

By Richard Davey, [Photon Storm](http://www.photonstorm.com)

I build a lot of HTML5 games in [TypeScript](http://www.typescriptlang.org) which includes converting Flash AS3 games. I found that I was going through the same processes over and over again when converting the AS3 source code to TypeScript. Simple things like swapping "Boolean" for "bool" and many other tedious tasks. So I wrote a PHP script that would do it for me and I'm sharing it here with you.

Getting Started Guide
---------------------

Checkout the git repo.

You will need to be running a local httpd server with PHP support. On Windows I recommend [WAMP Server](http://www.wampserver.com/en/) and on OS X [MAMP Pro](http://www.mamp.info/en/mamp-pro/).

You'll find an `index.php` file and 2 folders: `input` and `output`.

Copy your ActionScript files to the `input` folder. You can copy across a whole project folder if you like. The script is intelligent enough to deep-scan your folder structure and only pick-up `.as` files.

Load the `index.php` page in a web browser and if all is well it should give you a list of the AS files.

You can now elect to convert either a single file by clicking on it, or batch convert the whole lot.

Your web server will need local write permissions to save the generated TypeScript files.

If the output folder doesn't exist it will be created. If the output folder already exists any files in it will be automatically over-written.

Conversion Tasks
----------------

Currently the following tasks are performed by the script:

* Boolean to bool
* uint to number
* int to number
* Number to number
* remove :void
* rename package to module
* public class to class
* comment out import statements
* 'internal var' to 'private' (as close as TS gets, but often incorrect)
* swap static order
* append class name in front of consts
* 'protected var' to 'private' (as close as TS gets, but often incorrect)
* 'public var' to 'public'
* public function
* private function
* internal function
* override public function
* constructor swap
* remove :Array
* remove :Function
* String to string
* new Array() to []
* public static function to public
* remove :Class

It will also generate a list of class level consts and properties.

It's easy to add extra tests, or re-order the sequence in which they are performed so please feel free to do so if the default set don't quite meet your needs!

Contributing
------------

If you create a new task for the script that you think would benefit others then please send it to me (or send a git pull request).

Bugs?
-----

Please add them to the [Issue Tracker][1] with as much info as possible.

License
-------

Copyright 2013 Richard Davey. All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are
permitted provided that the following conditions are met:

   1. Redistributions of source code must retain the above copyright notice, this list of
      conditions and the following disclaimer.

   2. Redistributions in binary form must reproduce the above copyright notice, this list
      of conditions and the following disclaimer in the documentation and/or other materials
      provided with the distribution.

THIS SOFTWARE IS PROVIDED BY RICHARD DAVEY ``AS IS'' AND ANY EXPRESS OR IMPLIED
WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL RICHARD DAVEY OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON
ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

The views and conclusions contained in the software and documentation are those of the
authors and should not be interpreted as representing official policies, either expressed

[1]: https://github.com/photonstorm/AS3toTypeScript/issues
