
///<reference path="../../_definitions.ts"/>

module away.base
{

    /**
     * Texture coordinates value object.
     */
    export class UV
    {
        private _u : number;
        private _v : number;

        /**
         * Creates a new <code>UV</code> object.
         *
         * @param    u        [optional]    The horizontal coordinate of the texture value. Defaults to 0.
         * @param    v        [optional]    The vertical coordinate of the texture value. Defaults to 0.
         */
        constructor( u : number = 0 , v : number = 0)
        {
            this._u = u;
            this._v = v;
        }

        /**
         * Defines the vertical coordinate of the texture value.
         */
        public get v():number
        {
            return this._v;
        }

        public set v(value:number)
        {
            this._v = value;
        }

        /**
         * Defines the horizontal coordinate of the texture value.
         */
        public get u():number
        {
            return this._u;
        }

        public set u(value:number)
        {
            this._u = value;
        }

        /**
         * returns a new UV value Object
         */
        public clone():UV
        {
            return new UV(this._u, this._v);
        }

        /**
         * returns the value object as a string for trace/debug purpose
         */
        public toString():string
        {
            return this._u + "," + this._v;
        }

    }

}
