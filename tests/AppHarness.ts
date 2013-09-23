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
        private testIframe      : HTMLIFrameElement;
        private srcIframe       : HTMLIFrameElement;
        private counter         : number = 0;

        //------------------------------------------------------------------------------

        constructor()
        {

            this.initFrameSet();
            this.initInterface();

            /*
            this.dropDown           = <HTMLSelectElement> this.getId('selectTest');

            this.previous           = <HTMLButtonElement> this.getId('previous');
            this.next               = <HTMLButtonElement> this.getId('next');
            */

            this.previous.onclick   = () => this.nagigateBy( -1 );
            this.next.onclick       = () => this.nagigateBy( 1 );

            this.dropDown.onchange  = ( e ) => this.dropDownChange( e );

        }

        //------------------------------------------------------------------------------

        /**
         *
         * Load a test
         *
         * @param classPath - Module and Class path of test
         * @param js Path to JavaScript file
         * @param ts Path to Typescript file ( not yet used - reserved for future show source )
         */
        public load( classPath : string , js : string , ts : string ) : void
        {
            this.testIframe.src = 'frame.html?name=' + classPath + '&js=' + js;
            this.srcIframe.src = ts;
        }

        /**
         *
         * Add a test to the AppHarness
         *
         * @param name Name of test
         * @param classPath - Module and Class path of test
         * @param js Path to JavaScript file
         * @param ts Path to Typescript file ( not yet used - reserved for future show source )
         */
        public addTest( name : string , classpath : string , js : string , ts : string ) : void
        {
            this.tests.push ( new TestData( name , classpath , js , ts ) );
        }

        /**
         *
         * Add a separator to the menu
         *
         * @param name
         */
        public addSeperator( name : string = '' ) : void
        {
            this.tests.push ( new TestData( '-- ' + name , '' , '' , '') );
        }

        /**
         *
         * Start the application harness
         *
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

        /**
         *
         */
        private initInterface() : void
        {

            var testSelector : HTMLDivElement   = <HTMLDivElement> document.createElement( 'div' );
                testSelector.style.cssFloat     = 'none';
                testSelector.style.position     = 'absolute';
                testSelector.style.bottom       = '15px';
                testSelector.style.width        = '600px';
                testSelector.style.left         = '50%';
                testSelector.style.marginLeft   = '-300px'
                testSelector.style.textAlign    = 'center';


            this.dropDown                       = <HTMLSelectElement> document.createElement( 'select' );
            this.dropDown.name                  = "selectTestDropDown"
            this.dropDown.id                    = "selectTest"

            this.previous                       = <HTMLButtonElement> document.createElement( 'button' );
            this.previous.innerHTML             = '<<';
            this.previous.id                    = 'previous';

            this.next                           = <HTMLButtonElement> document.createElement( 'button' );
            this.next.innerHTML                 = '>>';
            this.next.id                        = 'next';


            testSelector.appendChild( this.previous );
            testSelector.appendChild( this.dropDown );
            testSelector.appendChild( this.next );
            document.body.appendChild( testSelector );
        }
        /**
         *
         */
        private initFrameSet() : void
        {

            console.log( 'initFrameSet');

            var iframeContainer : HTMLDivElement    = <HTMLDivElement> document.createElement( 'div' );
                iframeContainer.style.width         = '100%';
                iframeContainer.style.height        = '100%';

            this.testIframe                      = <HTMLIFrameElement> document.createElement( 'iframe' );
            this.testIframe.id                   = 'testContainer';
            this.testIframe.style.backgroundColor = '#9e9e9e';
            this.testIframe.style.cssFloat       = 'none';
            this.testIframe.style.position       = 'absolute';
            this.testIframe.style.top            = '0px';
            this.testIframe.style.left           = '0px';
            this.testIframe.style.border         = '0px';
            this.testIframe.style.width          = '100%';
            this.testIframe.style.height         = '100%';
            //bottom: 120px;

            this.srcIframe                          = <HTMLIFrameElement> document.createElement( 'iframe' );
            this.srcIframe.id                       = 'testSourceContainer';
            this.srcIframe.style.backgroundColor    = '#9e9e9e';
            this.srcIframe.style.cssFloat           = 'none';
            this.srcIframe.style.position           = 'absolute';
            this.srcIframe.style.right              = '0px';
            this.srcIframe.style.top                = '0px';
            this.srcIframe.style.bottom             = '0px';
            this.srcIframe.style.border             = '0px';
            this.srcIframe.style.width              = '0%';
            this.srcIframe.style.height             = '100%';

            iframeContainer.appendChild( this.testIframe );
            iframeContainer.appendChild( this.srcIframe );

            document.body.appendChild( iframeContainer );

        }

        /**
         *
         * Selectnext / previous menu item
         *
         * @param direction
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

        /**
         *
         * Navigate to a section
         *
         * @param testData
         */
        private navigateToSection ( testData : TestData ) : void
        {
            this.srcIframe.src = testData.src;
            this.testIframe.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;

        }

        //------------------------------------------------------------------------------
        // Utils

        /**
         *
         * Util function - get Element by ID
         *
         * @param id
         * @returns {HTMLElement}
         */
        private getId(id : string ) : HTMLElement
        {

            return document.getElementById( id );

        }


        //------------------------------------------------------------------------------
        // Events

        /**
         *
         * Dropbox event handler
         *
         * @param e
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

        /**
         *
         * Load a JavaScript file
         *
         * @param url - URL of JavaScript file
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

        /**
         *
         * Event Handler for loaded JavaScript files
         *
         */
        private jsLoaded()
        {

            var createPath : Array<string> = this.classPath.split('.'); // Split the classpath
            var obj         : any;

            for ( var c : number = 0 ; c < createPath.length ; c++ )
            {

                if ( obj == null )
                {
                    obj = window[createPath[c]]; // reference base module ( will be a child of the window )
                }
                else
                {
                    obj = obj[createPath[c]]; // reference sub module / Class
                }


            }

            if ( obj != null )
            {
                new obj(); // if Class has been found - start the test
            }

        }

        /**
         *
         * Utility function - Parse a Query formatted string
         *
         * @param qs
         * @returns {{}}
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