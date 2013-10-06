var tests;
(function (tests) {
    ///<reference path="../../../build/Away3D.next.d.ts" />
    (function (utils) {
        var TimerTest = (function () {
            function TimerTest() {
                this.oneSecondTimer = new away.utils.Timer(1000);
                this.oneSecondTimer.addEventListener(away.events.TimerEvent.TIMER, this.onSecTimerEvent, this);
                this.oneSecondTimer.start();

                this.repeatTenTimes = new away.utils.Timer(100, 10);
                this.repeatTenTimes.addEventListener(away.events.TimerEvent.TIMER, this.repeatTenTimesEvent, this);
                this.repeatTenTimes.addEventListener(away.events.TimerEvent.TIMER_COMPLETE, this.repeatTenTimesComplete, this);
                this.repeatTenTimes.start();
            }
            TimerTest.prototype.repeatTenTimesEvent = function (e) {
                var t = e.target;
                console.log('repeatTenTimesEvent', t.currentCount);
            };

            TimerTest.prototype.repeatTenTimesComplete = function (e) {
                var t = e.target;
                console.log('repeatTenTimesComplete', t.currentCount);
            };

            TimerTest.prototype.onSecTimerEvent = function (e) {
                console.log('onSecTimerEvent, tick');
                console.log('getTimer() : ', away.utils.getTimer());
            };
            return TimerTest;
        })();
        utils.TimerTest = TimerTest;
    })(tests.utils || (tests.utils = {}));
    var utils = tests.utils;
})(tests || (tests = {}));
//# sourceMappingURL=TimerTest.js.map
