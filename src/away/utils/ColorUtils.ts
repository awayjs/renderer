module away.utils
{
    export class ColorUtils
    {

        public static float32ColorToARGB( float32Color : number ) : Array
        {

            var a       : number = ( float32Color & 0xff000000 ) >>> 24
            var r       : number = ( float32Color & 0xff0000 ) >>> 16;
            var g       : number = ( float32Color & 0xff00 ) >>> 8;
            var b       : number = float32Color & 0xff;
            var result  : Array  = [ a, r , g , b ];

            return result;

        }

        private static componentToHex( c : number ) : string
        {

            var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;

        }

        public static RGBToHexString( argb : Array ) : string
        {

            return "#" + ColorUtils.componentToHex( argb[1] ) + ColorUtils.componentToHex( argb[2] ) + ColorUtils.componentToHex( argb[3] );

        }

        public static ARGBToHexString( argb : Array ) : string
        {

            return "#" + ColorUtils.componentToHex( argb[0] ) + ColorUtils.componentToHex( argb[1] ) + ColorUtils.componentToHex( argb[2] ) + ColorUtils.componentToHex( argb[3] );

        }


    }
}