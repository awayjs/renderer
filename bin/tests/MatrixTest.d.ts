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
    class MatrixTest {
        private ma;
        private mb;
        constructor();
    }
}
