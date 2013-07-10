
module away.errors
{

    export class Error
    {

        private _errorID    : number = 0;   //Contains the reference number associated with the specific error message.
        private _messsage   : string = '';  //Contains the message associated with the Error object.
        private _name       : string = '';  // Contains the name of the Error object.

        constructor(message : string = '' , id : number = 0 , _name : string = '' )
        {

            this._messsage  = message;
            this._name      = name;
            this._errorID   = id;

        }

        /**
         *
         * @returns {string}
         */
        public get message() : string
        {

            return this._messsage;

        }

        /**
         *
         * @param value
         */
        public set message( value : string )
        {

            this._messsage = value;

        }

        /**
         *
         * @returns {string}
         */
        public get name() : string
        {

            return this._name;

        }

        /**
         *
         * @param value
         */
        public set name( value : string )
        {

            this._name = value;

        }

        /**
         *
         * @returns {number}
         */
        public get errorID() : number
        {

            return this._errorID;

        }

    }

}