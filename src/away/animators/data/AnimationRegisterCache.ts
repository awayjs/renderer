///<reference path="../../_definitions.ts"/>

module away.animators
{
	import ShaderRegisterElement = away.materials.ShaderRegisterElement;
	import Matrix3D = away.geom.Matrix3D;
	
	/**
	 * ...
	 */
	export class AnimationRegisterCache extends away.materials.ShaderRegisterCache
	{
		//vertex
		public positionAttribute:ShaderRegisterElement;
		public uvAttribute:ShaderRegisterElement;
		public positionTarget:ShaderRegisterElement;
		public scaleAndRotateTarget:ShaderRegisterElement;
		public velocityTarget:ShaderRegisterElement;
		public vertexTime:ShaderRegisterElement;
		public vertexLife:ShaderRegisterElement;
		public vertexZeroConst:ShaderRegisterElement;
		public vertexOneConst:ShaderRegisterElement;
		public vertexTwoConst:ShaderRegisterElement;
		public uvTarget:ShaderRegisterElement;
		public colorAddTarget:ShaderRegisterElement;
		public colorMulTarget:ShaderRegisterElement;
		//vary
		public colorAddVary:ShaderRegisterElement;
		public colorMulVary:ShaderRegisterElement;
		
		//fragment
		
		public uvVar:ShaderRegisterElement;
		
		//these are targets only need to rotate ( normal and tangent )
		public rotationRegisters:Array<ShaderRegisterElement>;
		
		public needFragmentAnimation:boolean;
		public needUVAnimation:boolean;
		
		public sourceRegisters:Array<string>;
		public targetRegisters:Array<string>;
		
		private indexDictionary:Object = new Object();
		
		//set true if has an node which will change UV
		public hasUVNode:boolean;
		//set if the other nodes need to access the velocity
		public needVelocity:boolean;
		//set if has a billboard node.
		public hasBillboard:boolean;
		//set if has an node which will apply color multiple operation
		public hasColorMulNode:boolean;
		//set if has an node which will apply color add operation
		public hasColorAddNode:boolean;
		
		constructor(profile:string)
		{
			super(profile);
		}
		
		public reset()
		{
			super.reset();
			
			this.rotationRegisters = new Array<ShaderRegisterElement>();
			this.positionAttribute = this.getRegisterFromString(this.sourceRegisters[0]);
			this.scaleAndRotateTarget = this.getRegisterFromString(this.targetRegisters[0]);
			this.addVertexTempUsages(this.scaleAndRotateTarget, 1);
			
			for (var i:number /*int*/ = 1; i < this.targetRegisters.length; i++) {
				this.rotationRegisters.push(this.getRegisterFromString(this.targetRegisters[i]));
				this.addVertexTempUsages(this.rotationRegisters[i - 1], 1);
			}

			this.scaleAndRotateTarget = new ShaderRegisterElement(this.scaleAndRotateTarget.regName, this.scaleAndRotateTarget.index); //only use xyz, w is used as vertexLife
			
			//allot const register

			this.vertexZeroConst = this.getFreeVertexConstant();
			this.vertexZeroConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 0);
			this.vertexOneConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 1);
			this.vertexTwoConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 2);
			
			//allot temp register
			this.positionTarget = this.getFreeVertexVectorTemp();
			this.addVertexTempUsages(this.positionTarget, 1);
			this.positionTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
			
			if (this.needVelocity) {
				this.velocityTarget = this.getFreeVertexVectorTemp();
				this.addVertexTempUsages(this.velocityTarget, 1);
				this.velocityTarget = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index);
				this.vertexTime = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index, 3);
				this.vertexLife = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index, 3);
			} else {
				var tempTime:ShaderRegisterElement = this.getFreeVertexVectorTemp();
				this.addVertexTempUsages(tempTime, 1);
				this.vertexTime = new ShaderRegisterElement(tempTime.regName, tempTime.index, 0);
				this.vertexLife = new ShaderRegisterElement(tempTime.regName, tempTime.index, 1);
			}
		
		}
		
		public setUVSourceAndTarget(UVAttribute:string, UVVaring:string)
		{
			this.uvVar = this.getRegisterFromString(UVVaring);
			this.uvAttribute = this.getRegisterFromString(UVAttribute);
			//uv action is processed after normal actions,so use offsetTarget as uvTarget
			this.uvTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
		}
		
		public setRegisterIndex(node:AnimationNodeBase, parameterIndex:number /*int*/, registerIndex:number /*int*/)
		{
			//8 should be enough for any node.
			var t:Array<number> /*int*/ = this.indexDictionary[node.id];

			if (t == null)
				t = this.indexDictionary[node.id] = new Array<number>(8) /*int*/;

			t[parameterIndex] = registerIndex;
		}
		
		public getRegisterIndex(node:AnimationNodeBase, parameterIndex:number /*int*/):number /*int*/
		{
			return (<Array<number>> this.indexDictionary[node.id])[parameterIndex];
		}
		
		public getInitCode():string
		{
			var len:number /*int*/ = this.sourceRegisters.length;
			var code:string = "";
			for (var i:number /*int*/ = 0; i < len; i++)
				code += "mov " + this.targetRegisters[i] + "," + this.sourceRegisters[i] + "\n";
			
			code += "mov " + this.positionTarget + ".xyz," + this.vertexZeroConst.toString() + "\n";
			
			if (this.needVelocity)
				code += "mov " + this.velocityTarget + ".xyz," + this.vertexZeroConst.toString() + "\n";
			
			return code;
		}
		
		public getCombinationCode():string
		{
			return "add " + this.scaleAndRotateTarget + ".xyz," + this.scaleAndRotateTarget + ".xyz," + this.positionTarget + ".xyz\n";
		}
		
		public initColorRegisters():string
		{
			var code:string = "";
			if (this.hasColorMulNode) {
				this.colorMulTarget = this.getFreeVertexVectorTemp();
				this.addVertexTempUsages(this.colorMulTarget, 1);
				this.colorMulVary = this.getFreeVarying();
				code += "mov " + this.colorMulTarget + "," + this.vertexOneConst + "\n";
			}
			if (this.hasColorAddNode) {
				this.colorAddTarget = this.getFreeVertexVectorTemp();
				this.addVertexTempUsages(this.colorAddTarget, 1);
				this.colorAddVary = this.getFreeVarying();
				code += "mov " + this.colorAddTarget + "," + this.vertexZeroConst + "\n";
			}
			return code;
		}
		
		public getColorPassCode():string
		{
			var code:string = "";
			if (this.needFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
				if (this.hasColorMulNode)
					code += "mov " + this.colorMulVary + "," + this.colorMulTarget + "\n";
				if (this.hasColorAddNode)
					code += "mov " + this.colorAddVary + "," + this.colorAddTarget + "\n";
			}
			return code;
		}
		
		public getColorCombinationCode(shadedTarget:string):string
		{
			var code:string = "";
			if (this.needFragmentAnimation && (this.hasColorAddNode || this.hasColorMulNode)) {
				var colorTarget:ShaderRegisterElement = this.getRegisterFromString(shadedTarget);
				this.addFragmentTempUsages(colorTarget, 1);
				if (this.hasColorMulNode)
					code += "mul " + colorTarget + "," + colorTarget + "," + this.colorMulVary + "\n";
				if (this.hasColorAddNode)
					code += "add " + colorTarget + "," + colorTarget + "," + this.colorAddVary + "\n";
			}
			return code;
		}
		
		private getRegisterFromString(code:string):ShaderRegisterElement
		{
			var temp:Array<string> = code.split(/(\d+)/);
			return new ShaderRegisterElement(temp[0], parseInt(temp[1]));
		}
		
		public vertexConstantData:Array<number> = new Array<number>();
		public fragmentConstantData:Array<number> = new Array<number>();
		
		private _numVertexConstant:number /*int*/;
		private _numFragmentConstant:number /*int*/;
		
		public get numVertexConstant():number /*int*/
		{
			return this._numVertexConstant;
		}
		
		public get numFragmentConstant():number /*int*/
		{
			return this._numFragmentConstant;
		}
		
		public setDataLength()
		{
			this._numVertexConstant = this.numUsedVertexConstants - this.vertexConstantOffset;
			this._numFragmentConstant = this.numUsedFragmentConstants - this.fragmentConstantOffset;
			this.vertexConstantData.length = this._numVertexConstant*4;
			this.fragmentConstantData.length = this._numFragmentConstant*4;
		}
		
		public setVertexConst(index:number /*int*/, x:number = 0, y:number = 0, z:number = 0, w:number = 0)
		{
			var _index:number /*int*/ = (index - this.vertexConstantOffset)*4;
			this.vertexConstantData[_index++] = x;
			this.vertexConstantData[_index++] = y;
			this.vertexConstantData[_index++] = z;
			this.vertexConstantData[_index] = w;
		}
		
		public setVertexConstFromArray(index:number /*int*/, data:Array<number>)
		{
			var _index:number /*int*/ = (index - this.vertexConstantOffset)*4;
			for (var i:number /*int*/ = 0; i < data.length; i++)
				this.vertexConstantData[_index++] = data[i];
		}
		
		public setVertexConstFromMatrix(index:number /*int*/, matrix:Matrix3D)
		{
			var rawData:Array<number> = matrix.rawData;
			var _index:number /*int*/ = (index - this.vertexConstantOffset)*4;
			this.vertexConstantData[_index++] = rawData[0];
			this.vertexConstantData[_index++] = rawData[4];
			this.vertexConstantData[_index++] = rawData[8];
			this.vertexConstantData[_index++] = rawData[12];
			this.vertexConstantData[_index++] = rawData[1];
			this.vertexConstantData[_index++] = rawData[5];
			this.vertexConstantData[_index++] = rawData[9];
			this.vertexConstantData[_index++] = rawData[13];
			this.vertexConstantData[_index++] = rawData[2];
			this.vertexConstantData[_index++] = rawData[6];
			this.vertexConstantData[_index++] = rawData[10];
			this.vertexConstantData[_index++] = rawData[14];
			this.vertexConstantData[_index++] = rawData[3];
			this.vertexConstantData[_index++] = rawData[7];
			this.vertexConstantData[_index++] = rawData[11];
			this.vertexConstantData[_index] = rawData[15];
		
		}
		
		public setFragmentConst(index:number /*int*/, x:number = 0, y:number = 0, z:number = 0, w:number = 0)
		{
			var _index:number /*int*/ = (index - this.fragmentConstantOffset)*4;
			this.fragmentConstantData[_index++] = x;
			this.fragmentConstantData[_index++] = y;
			this.fragmentConstantData[_index++] = z;
			this.fragmentConstantData[_index] = w;
		}
	}

}
