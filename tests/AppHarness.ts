module away
{

    //---------------------------------------------------
    // Application Harness

    export class AppHarness
    {

        //------------------------------------------------------------------------------

        private tests           : Array<TestData> = new Array<TestData>();
        private dropDown        : HTMLSelectElement
        private contentIFrame   : HTMLIFrameElement;
        private srcIFrame       : HTMLIFrameElement;

        //------------------------------------------------------------------------------

        constructor()
        {

            this.dropDown           = <HTMLSelectElement> this.getId('selectTest');
            this.dropDown.onchange  = ( e ) => this.dropDownChange( e );

            this.contentIFrame      = <HTMLIFrameElement> this.getId('testContainer');
            this.srcIFrame          = <HTMLIFrameElement> this.getId('testSourceContainer');

        }

        //------------------------------------------------------------------------------
        // Init

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

            var dataIndex : number = parseInt( this.dropDown.options[this.dropDown.selectedIndex].value ) ;

            if ( ! isNaN( dataIndex ) )
            {
                var testData : TestData = this.tests[dataIndex];
                console.log( testData.classpath , testData.js , testData.src );

                this.srcIFrame.src = testData.src;
                this.contentIFrame.src = 'frame.html?name=' + testData.classpath + '&js=' + testData.js;

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