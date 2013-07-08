///<reference path="../../events/EventDispatcher.ts" />
///<reference path="../../events/AssetEvent.ts" />
///<reference path="../../events/TimerEvent.ts" />
///<reference path="../../events/ParserEvent.ts" />
///<reference path="../../library/assets/IAsset.ts" />
///<reference path="../../library/assets/AssetType.ts" />
///<reference path="../../loaders/misc/ResourceDependency.ts" />
///<reference path="../../utils/Timer.ts" />
///<reference path="../../utils/getTimer.ts" />

module away.loaders {

    export class ParserLoaderType {

        public static URL_LOADER : string = 'ParserLoaderType_URLLoader';
        public static IMG_LOADER : string = 'ParserLoaderType_IMGLoader';

    }

}