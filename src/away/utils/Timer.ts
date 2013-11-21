///<reference path="../_definitions.ts"/>

module away.utils
{


	//[native(cls="TimerClass", gc="exact", instance="TimerObject", methods="auto")]
	//[Event(name="timerComplete", type="flash.events.TimerEvent")]
	//[Event(name="timer", type="flash.events.TimerEvent")]

	export class Timer extends away.events.EventDispatcher
	{

		private _delay:number;
		private _repeatCount:number = 0;
		private _currentCount:number = 0;
		private _iid:number;
		private _running:boolean = false;

		constructor(delay:number, repeatCount:number = 0)
		{

			super();


			this._delay = delay;
			this._repeatCount = repeatCount;

			if (isNaN(delay) || delay < 0) {
				throw new away.errors.Error("Delay is negative or not a number");
			}

		}

		public get currentCount():number
		{

			return this._currentCount;

		}

		public get delay():number
		{

			return this._delay;

		}

		public set delay(value:number)
		{

			this._delay = value;

			if (this._running) {
				this.stop();
				this.start();
			}

		}

		public get repeatCount():number
		{

			return this._repeatCount;
		}

		public set repeatCount(value:number)
		{

			this._repeatCount = value;
		}

		public reset():void
		{

			if (this._running) {
				this.stop();
			}

			this._currentCount = 0;

		}

		public get running():boolean
		{

			return this._running;

		}

		public start():void
		{

			this._running = true;
			clearInterval(this._iid);
			this._iid = setInterval(() => this.tick(), this._delay);

		}

		public stop():void
		{

			this._running = false;
			clearInterval(this._iid);

		}

		private tick():void
		{

			this._currentCount++;

			if (( this._repeatCount > 0 ) && this._currentCount >= this._repeatCount) {

				this.stop();
				this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER));
				this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER_COMPLETE));

			} else {

				this.dispatchEvent(new away.events.TimerEvent(away.events.TimerEvent.TIMER));

			}

		}
	}
}
