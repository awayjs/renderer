///<reference path="../../events/EventDispatcher.ts" />
///<reference path="../../net/URLRequest.ts" />
module away.loaders
{
    //import away3d.arcane;
    //import away3d.library.assets.IAsset;
    //import away3d.loaders.parsers.ParserBase;

    //import flash.net.URLRequest;

    //use namespace arcane;

    /**
     * ResourceDependency represents the data required to load, parse and resolve additional files ("dependencies")
     * required by a parser, used by ResourceLoadSession.
     *
     */
    export interface ISingleFileTSLoader extends away.events.EventDispatcher {

        data : any;
        load( rep : away.net.URLRequest ) : void ;

    }

}
