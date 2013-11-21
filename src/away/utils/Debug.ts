///<reference path="../_definitions.ts"/>

module away
{

	export class Debug
	{

		public static THROW_ERRORS:boolean = true;
		public static ENABLE_LOG:boolean = true;
		public static LOG_PI_ERRORS:boolean = true;

		private static keyword:string = null;

		public static breakpoint():void
		{
			away.Debug['break']();
		}

		public static throwPIROnKeyWordOnly(str:string, enable:boolean = true)
		{

			if (!enable) {
				away.Debug.keyword = null;
			} else {
				away.Debug.keyword = str;
			}

		}

		public static throwPIR(clss:string, fnc:string, msg:string)
		{

			Debug.logPIR('PartialImplementationError ' + clss, fnc, msg);

			if (Debug.THROW_ERRORS) {

				if (away.Debug.keyword) {

					var e:string = clss + fnc + msg;

					if (e.indexOf(away.Debug.keyword) == -1) {
						return;
					}

				}

				throw new away.errors.PartialImplementationError(clss + '.' + fnc + ': ' + msg);

			}

		}

		private static logPIR(clss:string, fnc:string, msg:string = '')
		{

			if (Debug.LOG_PI_ERRORS) {

				console.log(clss + '.' + fnc + ': ' + msg);

			}

		}

		public static log(...args:any[])
		{

			if (Debug.ENABLE_LOG) {

				console.log.apply(console, arguments);

			}

		}

	}

}
