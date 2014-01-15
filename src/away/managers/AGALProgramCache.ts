///<reference path="../_definitions.ts"/>

module away.managers
{
	import StageGLEvent						= away.events.StageGLEvent;

	import AGALProgramCache					= away.managers.AGALProgramCache;
	import StageGLProxy						= away.managers.StageGLProxy;

	export class AGALProgramCache
	{
		private static _instances:AGALProgramCache[];

		private _stageGLProxy:StageGLProxy;

		private _program3Ds:Object;
		private _ids:Object;
		private _usages:Object;
		private _keys:Object;

		private _onContextGLDisposedDelegate:Function;

		private static _currentId:number = 0;

		constructor(stageGLProxy:StageGLProxy, agalProgramCacheSingletonEnforcer:AGALProgramCacheSingletonEnforcer)
		{
			if (!agalProgramCacheSingletonEnforcer)
				throw new Error("This class is a multiton and cannot be instantiated manually. Use StageGLManager.getInstance instead.");

			this._stageGLProxy = stageGLProxy;

			this._program3Ds = new Object();
			this._ids = new Object();
			this._usages = new Object();
			this._keys = new Object();
		}

		public static getInstance(stageGLProxy:StageGLProxy):away.managers.AGALProgramCache
		{
			var index:number = stageGLProxy._iStageGLIndex;

			if (AGALProgramCache._instances == null)
				AGALProgramCache._instances = new Array<AGALProgramCache>(8);


			if (!AGALProgramCache._instances[index]) {
				AGALProgramCache._instances[index] = new AGALProgramCache(stageGLProxy, new AGALProgramCacheSingletonEnforcer());

				stageGLProxy.addEventListener(StageGLEvent.CONTEXTGL_DISPOSED, AGALProgramCache.onContextGLDisposed);
				stageGLProxy.addEventListener(StageGLEvent.CONTEXTGL_CREATED, AGALProgramCache.onContextGLDisposed);
				stageGLProxy.addEventListener(StageGLEvent.CONTEXTGL_RECREATED, AGALProgramCache.onContextGLDisposed);
			}

			return AGALProgramCache._instances[index];

		}

		public static getInstanceFromIndex(index:number):away.managers.AGALProgramCache
		{
			if (!AGALProgramCache._instances[index])
				throw new Error("Instance not created yet!");

			return AGALProgramCache._instances[index];
		}

		private static onContextGLDisposed(event:StageGLEvent)
		{
			var stageGLProxy:StageGLProxy = <StageGLProxy> event.target;

			var index:number = stageGLProxy._iStageGLIndex;

			AGALProgramCache._instances[index].dispose();
			AGALProgramCache._instances[index] = null;

			stageGLProxy.removeEventListener(StageGLEvent.CONTEXTGL_DISPOSED, AGALProgramCache.onContextGLDisposed);
			stageGLProxy.removeEventListener(StageGLEvent.CONTEXTGL_CREATED, AGALProgramCache.onContextGLDisposed);
			stageGLProxy.removeEventListener(StageGLEvent.CONTEXTGL_RECREATED, AGALProgramCache.onContextGLDisposed);

		}

		public dispose()
		{
			for (var key in this._program3Ds)
				this.destroyProgram(key);

			this._keys = null;
			this._program3Ds = null;
			this._usages = null;
		}

		public setProgram(pass:away.materials.MaterialPassBase, vertexCode:string, fragmentCode:string)
		{
			var stageIndex:number = this._stageGLProxy._iStageGLIndex;
			var program:away.displayGL.Program;
			var key:string = this.getKey(vertexCode, fragmentCode);

			if (this._program3Ds[key] == null) {
				this._keys[AGALProgramCache._currentId] = key;
				this._usages[AGALProgramCache._currentId] = 0;
				this._ids[key] = AGALProgramCache._currentId;
				++AGALProgramCache._currentId;

				program = this._stageGLProxy._iContextGL.createProgram();

				//away.Debug.throwPIR( 'AGALProgramCache' , 'setProgram' , 'Dependency: AGALMiniAssembler.assemble');

				//TODO: implement AGAL <> GLSL

				//var vertexByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.VERTEX, vertexCode);
				//var fragmentByteCode:ByteArray = new AGALMiniAssembler(Debug.active).assemble(ContextGLProgramType.FRAGMENT, fragmentCode);
				//program.upload(vertexByteCode, fragmentByteCode);

				/*
				 var vertexByteCode  : ByteArray = new AGLSLCompiler().assemble( ContextGLProgramType.VERTEX , vertexCode );
				 var fragmentByteCode: ByteArray = new AGLSLCompiler().assemble( ContextGLProgramType.FRAGMENT , fragmentCode );

				 program.uploadGLSL(vertexByteCode, fragmentByteCode);

				 */

				var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
				var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();

				var vertString:string = vertCompiler.compile(away.displayGL.ContextGLProgramType.VERTEX, vertexCode);
				var fragString:string = fragCompiler.compile(away.displayGL.ContextGLProgramType.FRAGMENT, fragmentCode);

				console.log('===GLSL=========================================================');
				console.log('vertString');
				console.log(vertString);
				console.log('fragString');
				console.log(fragString);

				console.log('===AGAL=========================================================');
				console.log('vertexCode');
				console.log(vertexCode);
				console.log('fragmentCode');
				console.log(fragmentCode);


				program.upload(vertString, fragString);
				/*

				 var vertCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();
				 var fragCompiler:aglsl.AGLSLCompiler = new aglsl.AGLSLCompiler();

				 var vertString : string = vertCompiler.compile( away.displayGL.ContextGLProgramType.VERTEX, this.pGetVertexCode() );
				 var fragString : string = fragCompiler.compile( away.displayGL.ContextGLProgramType.FRAGMENT, this.pGetFragmentCode() );

				 this._program3D.upload( vertString , fragString );

				 */

				this._program3Ds[key] = program;
			}

			var oldId:number = pass._iProgramids[stageIndex];
			var newId:number = this._ids[key];

			if (oldId != newId) {
				if (oldId >= 0)
					this.freeProgram(oldId);

				this._usages[newId]++;
			}

			pass._iProgramids[stageIndex] = newId;
			pass._iPrograms[stageIndex] = this._program3Ds[key];
		}

		public freeProgram(programId:number)
		{
			this._usages[programId]--;

			if (this._usages[programId] == 0)
				this.destroyProgram(this._keys[programId]);
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

class AGALProgramCacheSingletonEnforcer
{
}