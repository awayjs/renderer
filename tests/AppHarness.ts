module away
{

    //---------------------------------------------------
    // Application Harness

    export class AppHarness
    {

        //------------------------------------------------------------------------------

        private tests           : Array<TestData> = new Array<TestData>();
        private dropDown        : HTMLSelectElement;
        private previous        : HTMLButtonElement
        private next            : HTMLButtonElement
        private contentIFrame   : HTMLIFrameElement;
        private srcIFrame       : HTMLIFrameElement;

        private counter         : number = 0;

        //------------------------------------------------------------------------------

        constructor()
        {

            this.dropDown           = <HTMLSelectElement> this.getId('selectTest');

            this.previous           = <HTMLButtonElement> this.getId('previous');
            this.next               = <HTMLButtonElement> this.getId('next');

            this.previous.onclick   = () => this.nagigateBy( -1 );
            this.next.onclick       = () => this.nagigateBy( 1 );

            this.dropDown.onchange  = ( e ) => this.dropDownChange( e );

            this.contentIFrame      = <HTMLIFrameElement> this.getId('testContainer');
            this.srcIFrame          = <HTMLIFrameElement> this.getId('testSourceContainer');

        }

        //------------------------------------------------------------------------------

        /*
         */
        public load( classPath : string , js : string , ts : string ) : void
        {
            this.contentIFrame.src = 'frame.html?name=' + classPath + '&js=' + js;
            this.srcIFrame.src = ts;
        }
        /*
         */
        public addTest( name : string , classpath : string , js : string , ts : string ) : void
        {
            this.tests.push ( new TestData( name , classpath , js , ts ) );
        }
        /*
         */
        public addSeperator( name : string = '' ) : void
        {
            this.tests.push ( new TestData( '-- ' + name , '' , '' , '') );
        }
        /*
         */
        public start() : void
        {

            for ( var c : number = 0 ; c < this.tests.length ; c ++  )
            {

                var option : HTMLOptionElement = <HTMLOptionElement> new Option( this.tests[c].name , String( c ) );
                this.dropDown.add( option );

            }

        }

        //------------------------------------------------------------------------------

        /*
         */
        private nagigateBy( direction : number = 1 ) : void
        {

            var l : number  = this.tests.length;
            var nextCounter = this.counter + direction;

            if ( nextCounter < 0 )
            {
                nextCounter = this.tests.length - 1;
            }
            else if ( nextCounter > this.tests.length - 1 )
            {
                nextCounter = 0;
            }

            var testData : TestData = this.tests[nextCounter];

            if ( testData.name.indexOf ('--') != -1 ) // skip section headers
            {
                this.counter = nextCounter;
                this.nagigateBy( direction );
            }
            else
            {
                this.navigateToSection( testData );
                this.dropDown.selectedIndex = nextCounter;
                this.counter = nextCounter;
            }

        }
        /*
         */
        private navigateToSection ( testData : TestData ) : void
        {
            this.srcIFrame.src = testData.src;
            this.contentIFrame.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;

        }

        //------------------------------------------------------------------------------
        // Utils

        /*
         */
        private getId(id : string ) : HTMLElement
        {

            return document.getElementById( id );

        }


        //------------------------------------------------------------------------------
        // Events

        /*
         */
        private dropDownChange( e ) : void
        {

            this.dropDown.options[this.dropDown.selectedIndex].value

            this.counter = this.dropDown.selectedIndex;

            var dataIndex : number = parseInt( this.dropDown.options[this.dropDown.selectedIndex].value ) ;

            if ( ! isNaN( dataIndex ) )
            {
                this.navigateToSection( this.tests[dataIndex] );
            }
        }

    }

    //---------------------------------------------------
    // Application Frame

    export class AppFrame
    {

        private classPath   : string = '';
        private jsPath      : string = '';

        constructor( )
        {

            var queryParams : any = AppFrame.getQueryParams( document.location.search );

            if ( queryParams.js != undefined && queryParams.name != undefined )
            {

                this.jsPath     = queryParams.js;
                this.classPath  = queryParams.name;
                this.loadJS( this.jsPath );

            }

        }
        /*
         */
        private loadJS(url : string )
        {

            var head : HTMLElement = <HTMLElement> document.getElementsByTagName("head")[0];
            var script : HTMLScriptElement = document.createElement("script");
            script.type     = "text/javascript";
            script.src      = url;
            script.onload   = () => this.jsLoaded();

            head.appendChild(script);
        }
        /*
         */
        private jsLoaded()
        {


            var createPath : Array<string> = this.classPath.split('.');
            var obj         : any;

            for ( var c : number = 0 ; c < createPath.length ; c++ )
            {

                if ( obj == null )
                {
                    obj = window[createPath[c]];
                }
                else
                {
                    obj = obj[createPath[c]];
                }


            }

            if ( obj != null )
            {
                new obj();
            }

        }
        /*
         */
        static getQueryParams( qs ) : Object {

            qs = qs.split("+").join(" ");

            var params = {}, tokens,
                re = /[?&]?([^=]+)=([^&]*)/g;

            while (tokens = re.exec(qs)) {
                params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
            }

            return params;
        }

    }

    //---------------------------------------------------
    // Data

    class TestData
    {
        public js           : string;
        public classpath    : string;
        public src          : string;
        public name         : string;

        constructor( name : string , classpath : string , js : string , src : string )
        {
            this.js         = js;
            this.classpath  = classpath;
            this.src        = src;
            this.name       = name;
        }
    }
}