///<reference path="../../events/EventDispatcher.ts" />
///<reference path="../../net/URLRequest.ts" />
module away.loaders
{

    export interface ISingleFileTSLoader extends away.events.EventDispatcher {

        data : any;
        load( rep : away.net.URLRequest ) : void ;
        dispose() : void ;

    }

}
