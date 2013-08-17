///<reference path="../_definitions.ts"/>

module away.managers
{

	export class AGALProgram3DCache
	{
		private static _instances:away.managers.AGALProgram3DCache[];
		
		private _stage3DProxy:away.managers.Stage3DProxy;

        private _program3Ds:Object;
        private _ids:Object;
        private _usages:Object;
        private _keys:Object;
		
		private static _currentId:number = 0;
		
		constructor(stage3DProxy:away.managers.Stage3DProxy, agalProgram3DCacheSingletonEnforcer:AGALProgram3DCacheSingletonEnforcer)
		{
			if (!agalProgram3DCacheSingletonEnforcer)
            {
				throw new Error("This class is a multiton and cannot be instantiated manually. Use Stage3DManager.getInstance instead.");
            }

			this._stage3DProxy = stage3DProxy;

            this._program3Ds = new Object();
            this._ids = new Object();
            this._usages = new Object();
            this._keys = new Object();

		}
		
		public static getInstance(stage3DProxy:away.managers.Stage3DProxy) : away.managers.AGALProgram3DCache
		{
			var index:number = stage3DProxy._iStage3DIndex;

            if ( AGALProgram3DCache._instances == null )
            {

                AGALProgram3DCache._instances = new Array<away.managers.AGALProgram3DCache>( 8 );

            }

			
			if ( ! AGALProgram3DCache._instances[index])
            {

                AGALProgram3DCache._instances[index] = new AGALProgram3DCache(stage3DProxy, new AGALProgram3DCacheSingletonEnforcer());

				stage3DProxy.addEventListener(away.events.Stage3DEvent.CONTEXT3D_DISPOSED, AGALProgram3DCache.onContext3DDisposed, AGALProgram3DCache );
				stage3DProxy.addEventListener(away.events.Stage3DEvent.CONTEXT3D_CREATED, AGALProgram3DCache.onContext3DDisposed, AGALProgram3DCache );
				stage3DProxy.addEventListener(away.events.Stage3DEvent.CONTEXT3D_RECREATED, AGALProgram3DCache.onContext3DDisposed, AGALProgram3DCache );
			}
			
			return AGALProgram3DCache._instances[index];

		}
		
		public static getInstanceFromIndex(index:number):AGALProgram3DCache
		{
			if (!AGALProgram3DCache._instances[index])
            {
				throw new Error("Instance not created yet!");
            }
			return AGALProgram3DCache._instances[index];
		}
		
		private static onContext3DDisposed(event:away.events.Stage3DEvent)
		{
			var stage3DProxy:away.managers.Stage3DProxy = <away.managers.Stage3DProxy>event.target;

			var index:number = stage3DProxy._iStage3DIndex;

            AGALProgram3DCache._instances[index].dispose();
            AGALProgram3DCache._instances[index] = null;

			stage3DProxy.removeEventListener(away.events.Stage3DEvent.CONTEXT3D_DISPOSED, AGALProgram3DCache.onContext3DDisposed , AGALProgram3DCache);
			stage3DProxy.removeEventListener(away.events.Stage3DEvent.CONTEXT3D_CREATED, AGALProgram3DCache.onContext3DDisposed, AGALProgram3DCache);
			stage3DProxy.removeEventListener(away.events.Stage3DEvent.CONTEXT3D_RECREATED, AGALProgram3DCache.onContext3DDisposed , AGALProgram3DCache);

		}
		
		public dispose()
		{
			for (var key in this._program3Ds)
            {

				this.destroyProgram(key);
            }

			this._keys = null;
            this._program3Ds = null;
            this._usages = null;
		}
		
		public setProgram3D(pass:away.materials.MaterialPassBase, vertexCode:string, fragmentCode:string)
		{
			var stageIndex:number = this._stage3DProxy._iStage3DIndex;
			var program:away.display3D.Program3D;
			var key:string = this.getKey(vertexCode, fragmentCode);
			
			if (this._program3Ds[key] == null)
            {
				this._keys[AGALProgram3DCache._currentId] = key;
                this._usages[AGALProgram3DCache._currentId] = 0;
                this._ids[key] = AGALProgram3DCache._currentId;
				++AGALProgram3DCache._currentId;

				program = this._stage3DProxy._iContext3D.createProgram();

                //away.Debug.throwPIR( 'AGALProgram3DCache' , 'setProgram3D' , 'Dependency: AGALMiniAssembler.assemble');

                //TODO: implement AGAL <> GLSL

				//var vertexByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(Context3DProgramType.VERTEX, vertexCode);
				//var fragmentByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(Context3DProgramType.FRAGMENT, fragmentCode);
				//program.upload(vertexByteCode, fragmentByteCode);

                /*
                 var vertexByteCode  : ByteArray = new AGLSLCompiler().assemble( Context3DProgramType.VERTEX , vertexCode );
                 var fragmentByteCode: ByteArray = new AGLSLCompiler().assemble( Context3DProgramType.FRAGMENT , fragmentCode );

                 program.uploadGLSL(vertexByteCode, fragmentByteCode);

                 */

                var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
                var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();

                var vertString : string = vertCompiler.compile( away.display3D.Context3DProgramType.VERTEX, vertexCode );
                var fragString : string = fragCompiler.compile( away.display3D.Context3DProgramType.FRAGMENT, fragmentCode );

                /*
                console.log( '===GLSL=========================================================');
                console.log( 'vertString' );
                console.log( vertString );
                console.log( 'fragString' );
                console.log( fragString );

                console.log( '===AGAL=========================================================');
                console.log( 'vertexCode' );
                console.log( vertexCode );
                console.log( 'fragmentCode' );
                console.log( fragmentCode );
                */

                program.upload(vertString, fragString);
                /*

                 var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
                 var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();

                 var vertString : string = vertCompiler.compile( away.display3D.Context3DProgramType.VERTEX, this.pGetVertexCode() );
                 var fragString : string = fragCompiler.compile( away.display3D.Context3DProgramType.FRAGMENT, this.pGetFragmentCode() );

                 this._program3D.upload( vertString , fragString );

                 */

				this._program3Ds[key] = program;
			}


			var oldId:number = pass._iProgram3Dids[stageIndex];
			var newId:number = this._ids[key];
			
			if (oldId != newId)
            {
				if (oldId >= 0)
                {
                    this.freeProgram3D(oldId);
                }

				this._usages[newId]++;

			}
			
			pass._iProgram3Dids[stageIndex] = newId;
			pass._iProgram3Ds[stageIndex] = this._program3Ds[key];

		}
		
		public freeProgram3D(programId:number)
		{
			this._usages[programId]--;

			if (this._usages[programId] == 0)
            {
				this.destroyProgram(this._keys[programId]);
            }

		}
		
		private destroyProgram(key:string)
		{
			this._program3Ds[key].dispose();
            this._program3Ds[key] = null;
			delete this._program3Ds[key];
            this._ids[key] = -1;

		}
		
		private getKey(vertexCode:string, fragmentCode:string):string
		{
			return vertexCode + "---" + fragmentCode;
		}
	}
}

class AGALProgram3DCacheSingletonEnforcer
{
}
