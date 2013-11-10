///<reference path="../_definitions.ts"/>

module away.utils
{
    /**
     * Helper class for casting assets to usable objects
     */
    export class Cast
    {
        private static _colorNames:Object;
        private static _hexChars:string = "0123456789abcdefABCDEF";

        private static _notClasses:Object = new Object();
        private static _classes:Object = new Object();

        public static string(data:any):string
        {
            if (typeof(data) == 'function')
            data = new data;

            if (typeof(data) == 'string')
                return data;

            return <string> data;
        }

        public static byteArray(data:any):ByteArray
        {
            if (typeof(data) == 'function')
                data = new data;
    
            if (data instanceof ByteArray)
                return data;
    
            return <ByteArray> data;
        }
    
//        public static xml(data:any):XML
//        {
//            if (typeof(data) == 'function')
//                data = new data;
//    
//            if (data is XML)
//                return data;
//    
//            return XML(data);
//        }

        private static isHex(str:string):boolean
        {
            var length:number /*int*/ = str.length;
            for (var i:number /*int*/ = 0; i < length; ++i) {
                if (this._hexChars.indexOf(str.charAt(i)) == -1)
                    return false;
            }
    
            return true;
        }
    
        public static tryColor(data:any):number /*uint*/
        {
            if (typeof(data) == 'number' /*uint*/)
                return Math.floor(<number> data);
    
            if (typeof(data) == 'string') {
                if (data == "random")
                    return Math.floor(Math.random()*0x1000000);

                if (this._colorNames == null) {
                    this._colorNames = new Object();
                    this._colorNames["steelblue"] = 0x4682B4;
                    this._colorNames["royalblue"] = 0x041690;
                    this._colorNames["cornflowerblue"] = 0x6495ED;
                    this._colorNames["lightsteelblue"] = 0xB0C4DE;
                    this._colorNames["mediumslateblue"] = 0x7B68EE;
                    this._colorNames["slateblue"] = 0x6A5ACD;
                    this._colorNames["darkslateblue"] = 0x483D8B;
                    this._colorNames["midnightblue"] = 0x191970;
                    this._colorNames["navy"] = 0x000080;
                    this._colorNames["darkblue"] = 0x00008B;
                    this._colorNames["mediumblue"] = 0x0000CD;
                    this._colorNames["blue"] = 0x0000FF;
                    this._colorNames["dodgerblue"] = 0x1E90FF;
                    this._colorNames["deepskyblue"] = 0x00BFFF;
                    this._colorNames["lightskyblue"] = 0x87CEFA;
                    this._colorNames["skyblue"] = 0x87CEEB;
                    this._colorNames["lightblue"] = 0xADD8E6;
                    this._colorNames["powderblue"] = 0xB0E0E6;
                    this._colorNames["azure"] = 0xF0FFFF;
                    this._colorNames["lightcyan"] = 0xE0FFFF;
                    this._colorNames["paleturquoise"] = 0xAFEEEE;
                    this._colorNames["mediumturquoise"] = 0x48D1CC;
                    this._colorNames["lightseagreen"] = 0x20B2AA;
                    this._colorNames["darkcyan"] = 0x008B8B;
                    this._colorNames["teal"] = 0x008080;
                    this._colorNames["cadetblue"] = 0x5F9EA0;
                    this._colorNames["darkturquoise"] = 0x00CED1;
                    this._colorNames["aqua"] = 0x00FFFF;
                    this._colorNames["cyan"] = 0x00FFFF;
                    this._colorNames["turquoise"] = 0x40E0D0;
                    this._colorNames["aquamarine"] = 0x7FFFD4;
                    this._colorNames["mediumaquamarine"] = 0x66CDAA;
                    this._colorNames["darkseagreen"] = 0x8FBC8F;
                    this._colorNames["mediumseagreen"] = 0x3CB371;
                    this._colorNames["seagreen"] = 0x2E8B57;
                    this._colorNames["darkgreen"] = 0x006400;
                    this._colorNames["green"] = 0x008000;
                    this._colorNames["forestgreen"] = 0x228B22;
                    this._colorNames["limegreen"] = 0x32CD32;
                    this._colorNames["lime"] = 0x00FF00;
                    this._colorNames["chartreuse"] = 0x7FFF00;
                    this._colorNames["lawngreen"] = 0x7CFC00;
                    this._colorNames["greenyellow"] = 0xADFF2F;
                    this._colorNames["yellowgreen"] = 0x9ACD32;
                    this._colorNames["palegreen"] = 0x98FB98;
                    this._colorNames["lightgreen"] = 0x90EE90;
                    this._colorNames["springgreen"] = 0x00FF7F;
                    this._colorNames["mediumspringgreen"] = 0x00FA9A;
                    this._colorNames["darkolivegreen"] = 0x556B2F;
                    this._colorNames["olivedrab"] = 0x6B8E23;
                    this._colorNames["olive"] = 0x808000;
                    this._colorNames["darkkhaki"] = 0xBDB76B;
                    this._colorNames["darkgoldenrod"] = 0xB8860B;
                    this._colorNames["goldenrod"] = 0xDAA520;
                    this._colorNames["gold"] = 0xFFD700;
                    this._colorNames["yellow"] = 0xFFFF00;
                    this._colorNames["khaki"] = 0xF0E68C;
                    this._colorNames["palegoldenrod"] = 0xEEE8AA;
                    this._colorNames["blanchedalmond"] = 0xFFEBCD;
                    this._colorNames["moccasin"] = 0xFFE4B5;
                    this._colorNames["wheat"] = 0xF5DEB3;
                    this._colorNames["navajowhite"] = 0xFFDEAD;
                    this._colorNames["burlywood"] = 0xDEB887;
                    this._colorNames["tan"] = 0xD2B48C;
                    this._colorNames["rosybrown"] = 0xBC8F8F;
                    this._colorNames["sienna"] = 0xA0522D;
                    this._colorNames["saddlebrown"] = 0x8B4513;
                    this._colorNames["chocolate"] = 0xD2691E;
                    this._colorNames["peru"] = 0xCD853F;
                    this._colorNames["sandybrown"] = 0xF4A460;
                    this._colorNames["darkred"] = 0x8B0000;
                    this._colorNames["maroon"] = 0x800000;
                    this._colorNames["brown"] = 0xA52A2A;
                    this._colorNames["firebrick"] = 0xB22222;
                    this._colorNames["indianred"] = 0xCD5C5C;
                    this._colorNames["lightcoral"] = 0xF08080;
                    this._colorNames["salmon"] = 0xFA8072;
                    this._colorNames["darksalmon"] = 0xE9967A;
                    this._colorNames["lightsalmon"] = 0xFFA07A;
                    this._colorNames["coral"] = 0xFF7F50;
                    this._colorNames["tomato"] = 0xFF6347;
                    this._colorNames["darkorange"] = 0xFF8C00;
                    this._colorNames["orange"] = 0xFFA500;
                    this._colorNames["orangered"] = 0xFF4500;
                    this._colorNames["crimson"] = 0xDC143C;
                    this._colorNames["red"] = 0xFF0000;
                    this._colorNames["deeppink"] = 0xFF1493;
                    this._colorNames["fuchsia"] = 0xFF00FF;
                    this._colorNames["magenta"] = 0xFF00FF;
                    this._colorNames["hotpink"] = 0xFF69B4;
                    this._colorNames["lightpink"] = 0xFFB6C1;
                    this._colorNames["pink"] = 0xFFC0CB;
                    this._colorNames["palevioletred"] = 0xDB7093;
                    this._colorNames["mediumvioletred"] = 0xC71585;
                    this._colorNames["purple"] = 0x800080;
                    this._colorNames["darkmagenta"] = 0x8B008B;
                    this._colorNames["mediumpurple"] = 0x9370DB;
                    this._colorNames["blueviolet"] = 0x8A2BE2;
                    this._colorNames["indigo"] = 0x4B0082;
                    this._colorNames["darkviolet"] = 0x9400D3;
                    this._colorNames["darkorchid"] = 0x9932CC;
                    this._colorNames["mediumorchid"] = 0xBA55D3;
                    this._colorNames["orchid"] = 0xDA70D6;
                    this._colorNames["violet"] = 0xEE82EE;
                    this._colorNames["plum"] = 0xDDA0DD;
                    this._colorNames["thistle"] = 0xD8BFD8;
                    this._colorNames["lavender"] = 0xE6E6FA;
                    this._colorNames["ghostwhite"] = 0xF8F8FF;
                    this._colorNames["aliceblue"] = 0xF0F8FF;
                    this._colorNames["mintcream"] = 0xF5FFFA;
                    this._colorNames["honeydew"] = 0xF0FFF0;
                    this._colorNames["lightgoldenrodyellow"] = 0xFAFAD2;
                    this._colorNames["lemonchiffon"] = 0xFFFACD;
                    this._colorNames["cornsilk"] = 0xFFF8DC;
                    this._colorNames["lightyellow"] = 0xFFFFE0;
                    this._colorNames["ivory"] = 0xFFFFF0;
                    this._colorNames["floralwhite"] = 0xFFFAF0;
                    this._colorNames["linen"] = 0xFAF0E6;
                    this._colorNames["oldlace"] = 0xFDF5E6;
                    this._colorNames["antiquewhite"] = 0xFAEBD7;
                    this._colorNames["bisque"] = 0xFFE4C4;
                    this._colorNames["peachpuff"] = 0xFFDAB9;
                    this._colorNames["papayawhip"] = 0xFFEFD5;
                    this._colorNames["beige"] = 0xF5F5DC;
                    this._colorNames["seashell"] = 0xFFF5EE;
                    this._colorNames["lavenderblush"] = 0xFFF0F5;
                    this._colorNames["mistyrose"] = 0xFFE4E1;
                    this._colorNames["snow"] = 0xFFFAFA;
                    this._colorNames["white"] = 0xFFFFFF;
                    this._colorNames["whitesmoke"] = 0xF5F5F5;
                    this._colorNames["gainsboro"] = 0xDCDCDC;
                    this._colorNames["lightgrey"] = 0xD3D3D3;
                    this._colorNames["silver"] = 0xC0C0C0;
                    this._colorNames["darkgrey"] = 0xA9A9A9;
                    this._colorNames["grey"] = 0x808080;
                    this._colorNames["lightslategrey"] = 0x778899;
                    this._colorNames["slategrey"] = 0x708090;
                    this._colorNames["dimgrey"] = 0x696969;
                    this._colorNames["darkslategrey"] = 0x2F4F4F;
                    this._colorNames["black"] = 0x000000;
                    this._colorNames["transparent"] = 0xFF000000;
                }

                if (this._colorNames[data] != null)
                    return this._colorNames[data];

                if (((<string> data).length == 6) && this.isHex(data))
                    return parseInt("0x" + data);
            }
    
            return null;
        }

        public static color(data:any):number /*uint*/
        {
            var result:number /*uint*/ = this.tryColor(data);

            if (result == null)
                throw new away.errors.CastError("Can't cast to color: " + data);

            return result;
        }

        public static tryClass(name:string):any
        {
            if (this._notClasses[name])
                return name;

            var result:any = this._classes[name];

            if (result != null)
                return result;

            try {
                result = window[name];
                this._classes[name] = result;
                return result;
            } catch (e /*ReferenceError*/) {
            }

            this._notClasses[name] = true;

            return name;
        }

        public static bitmapData(data:any):away.display.BitmapData
        {
            if (data == null)
                return null;

            if (typeof(data) == 'string')
                data = this.tryClass(data);

            if (typeof(data) == 'function') {
                try {
                    data = new data();
                } catch (e /*ArgumentError*/) {
                    data = new data(0, 0);
                }
            }

            if (data instanceof away.display.BitmapData)
                return data;

            if (data instanceof away.textures.HTMLImageElementTexture)
                data = (<away.textures.HTMLImageElementTexture> data).htmlImageElement;

            if (data instanceof HTMLImageElement) {
                var imageElement:HTMLImageElement = <HTMLImageElement> data;
                var bitmapData:away.display.BitmapData = new away.display.BitmapData(imageElement.width, imageElement.height, true, 0x0);
                bitmapData.draw(imageElement)
                return bitmapData;
            }

//            if (data is DisplayObject) {
//                var ds:DisplayObject = data as DisplayObject;
//                var bmd:BitmapData = new BitmapData(ds.width, ds.height, true, 0x00FFFFFF);
//                var mat:Matrix = ds.transform.matrix.clone();
//                mat.tx = 0;
//                mat.ty = 0;
//                bmd.draw(ds, mat, ds.transform.colorTransform, ds.blendMode, bmd.rect, true);
//                return bmd;
//            }

            throw new away.errors.CastError("Can't cast to BitmapData: " + data);
        }

        public static bitmapTexture(data:any):away.textures.BitmapTexture
        {
            if (data == null)
                return null;

            if (typeof(data) == 'string')
                data = this.tryClass(data);

            if (typeof(data) == 'function') {
                try {
                    data = new data();
                } catch (e /*ArgumentError*/) {
                    data = new data(0, 0);
                }
            }

            if (data instanceof away.textures.BitmapTexture)
                return data;

            try {
                var bmd:away.display.BitmapData = Cast.bitmapData(data);
                return new away.textures.BitmapTexture(bmd);
            } catch (e /*away.errors.CastError*/) {
            }

            throw new away.errors.CastError("Can't cast to BitmapTexture: " + data);
        }
    }
}
