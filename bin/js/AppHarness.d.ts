declare module away {
    class AppHarness {
        private tests;
        private dropDown;
        private previous;
        private next;
        private contentIFrame;
        private srcIFrame;
        private counter;
        constructor();
        public load(classPath: string, js: string, ts: string): void;
        public addTest(name: string, classpath: string, js: string, ts: string): void;
        public addSeperator(name?: string): void;
        public start(): void;
        private nagigateBy(direction?);
        private navigateToSection(testData);
        private getId(id);
        private dropDownChange(e);
    }
    class AppFrame {
        private classPath;
        private jsPath;
        constructor();
        private loadJS(url);
        private jsLoaded();
        static getQueryParams(qs): Object;
    }
}
