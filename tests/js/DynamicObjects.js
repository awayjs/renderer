///<reference path="../../build/Away3D.next.d.ts" />
//<reference path="../../src/Away3D.ts" />
//------------------------------------------------------------------------------------------------
// Web / PHP Storm arguments string
//------------------------------------------------------------------------------------------------
// --sourcemap $ProjectFileDir$/tests/TimerTest.ts --target ES5 --comments --out $ProjectFileDir$/tests/TimerTest.js
//------------------------------------------------------------------------------------------------
var TimerTest = (function () {
    function TimerTest() {
        var IamATimerClass = away.utils.Timer;

        this.oneSecondTimer = new IamATimerClass();

        this.oneSecondTimer.delay = 1000;
        this.oneSecondTimer.addEventListener(away.events.TimerEvent.TIMER, away.utils.Delegate.create(this, this.onSecTimerEvent));
        this.oneSecondTimer.start();
    }
    TimerTest.prototype.onSecTimerEvent = function (e) {
        console.log('onSecTimerEvent, tick');
    };
    return TimerTest;
})();

window.onload = function () {
    var test = new TimerTest();
};
//# sourceMappingURL=DynamicObjects.js.map
