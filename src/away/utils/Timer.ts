///<reference path="../events/EventDispatcher.ts" />

module away.utils
{


    //[native(cls="TimerClass", gc="exact", instance="TimerObject", methods="auto")]
    //[Event(name="timerComplete", type="flash.events.TimerEvent")]
    //[Event(name="timer", type="flash.events.TimerEvent")]

    export class Timer extends away.events.EventDispatcher
    {

        public static getTimer() : number
        {


        }

        private _delay          : number ;
        private _repeatCount    : number ;
        private _currentCount   : number = 0;
        private _iid            : number ;
        private _running        : boolean = false;

        contructor (delay : number , repeatCount : number = 0)
        {

            this._delay = delay;
            this._repeatCount = repeatCount;
        }

        public get currentCount() : number
        {

            return this._currentCount;

        }

        public get delay() : number
        {

            return this._delay;

        }

        public set delay(value : number )
        {

            this._delay = value;

        }

        public get repeatCount() : number
        {

            return this._repeatCount;
        }

        public set repeatCount(value : number )
        {

            this._repeatCount = value;
        }

        public reset() : void
        {

            // Check docs - stop / or just reset start time

        }

        public get running() : boolean
        {

            return this._running;

        }

        public start() : void
        {

            clearInterval( this._iid );
           // this._iid = setInterval( )

        }

        public stop() : void
        {

            clearInterval( this._iid );

        }

        private tick() : void
        {



        }
    }
}
