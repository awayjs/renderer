declare module away {
    class AppHarness {
        private tests;
        private dropDown;
        private contentIFrame;
        private srcIFrame;
        constructor();
        public load(classPath: string, js: string, ts: string): void;
        public addTest(name: string, classpath: string, js: string, ts: string): void;
        public addSeperator(name?: string): void;
        public start(): void;
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
