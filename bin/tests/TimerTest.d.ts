/// <reference path="../../lib/Away3D.next.d.ts" />
declare module tests.utils {
    class TimerTest {
        private oneSecondTimer;
        private repeatTenTimes;
        constructor();
        private repeatTenTimesEvent(e);
        private repeatTenTimesComplete(e);
        private onSecTimerEvent(e);
    }
}
