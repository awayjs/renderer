/// <reference path="../../lib/Away3D.next.d.ts" />
declare module parsers {
    /**
    * ImageParser provides a "parser" for natively supported image types (jpg, png). While it simply loads bytes into
    * a loader object, it wraps it in a BitmapDataResource so resource management can happen consistently without
    * exception cases.
    */
    class JSONTextureParser extends away.loaders.ParserBase {
        private STATE_PARSE_DATA;
        private STATE_LOAD_IMAGES;
        private STATE_COMPLETE;
        private _state;
        private _startedParsing;
        private _doneParsing;
        private _dependencyCount;
        private _loadedTextures;
        /**
        * Creates a new ImageParser object.
        * @param uri The url or id of the data or file to be parsed.
        * @param extra The holder for extra contextual data that the parser might need.
        */
        constructor();
        /**
        * Indicates whether or not a given file extension is supported by the parser.
        * @param extension The file extension of a potential file to be parsed.
        * @return Whether or not the given file type is supported.
        */
        static supportsType(extension: string): boolean;
        /**
        * Tests whether a data block can be parsed by the parser.
        * @param data The data block to potentially be parsed.
        * @return Whether or not the given data is supported.
        */
        static supportsData(data: any): boolean;
        /**
        * @inheritDoc
        */
        public _iResolveDependency(resourceDependency: away.loaders.ResourceDependency): void;
        /**
        * @inheritDoc
        */
        public _iResolveDependencyFailure(resourceDependency: away.loaders.ResourceDependency): void;
        private parseJson();
        /**
        * @inheritDoc
        */
        public _pProceedParsing(): boolean;
    }
}
declare module tests.geom {
    class VextMat3DTests {
        constructor();
        public testappend(): void;
        public testprependRotation(): void;
        public testcopyToMatrix3D(): void;
        public testDecompose(): void;
        public outputDecompose(result: number[], original: number[], a1: away.geom.Vector3D, a2: away.geom.Vector3D, a3: away.geom.Vector3D): void;
        public testPosition(): void;
        public outputPosition(result: number[], original: number[], posResult: away.geom.Vector3D): void;
        public testAppendScale(): void;
        public outputAppendScale(result: number[], original: number[], v: away.geom.Vector3D): void;
        public testAppendTranslation(): void;
        public outputAppendTranslation(result: number[], original: number[], v: away.geom.Vector3D): void;
        public testAppendRotation(): void;
        public testInvert(): void;
        public testCopyRowTo(): void;
        public testCopyColumnTo(): void;
        public outputAppendRotation(result: number[], original: number[], axis: away.geom.Vector3D, pivot: away.geom.Vector3D): void;
        public outputInvert(success: boolean, data: Array<T>, original: Array<T>): void;
        public output(data: Array<T>, result: number): void;
        public getRnd(max: number, min: number): number;
    }
}
