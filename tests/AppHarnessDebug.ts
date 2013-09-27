///<reference path="../src/Away3D.ts"/>
///<reference path="unit/TestSuite.ts"/>
///<reference path="away/library/AWDParserTest.ts"/>
///<reference path="demos/parsers/AWDSuzanne.ts"/>

module away
{
    export class AppHarnessDebug
    {
        constructor()
        {
            //new tests.unit.TestSuite();
            setTimeout(this.init , 1000 );
        }

        private init() : void
        {

            new tests.library.AWDParserTest();
            //new demos.parsers.AWDSuzanne();

        }

    }
}

window.onload = function ()
{
    var app = new away.AppHarnessDebug();
}