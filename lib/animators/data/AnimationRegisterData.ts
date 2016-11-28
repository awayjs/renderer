import {AnimationNodeBase} from "@awayjs/graphics";

import {ShaderRegisterCache} from "../../shaders/ShaderRegisterCache";
import {ShaderRegisterData} from "../../shaders/ShaderRegisterData";
import {ShaderRegisterElement} from "../../shaders/ShaderRegisterElement";

/**
 * ...
 */
export class AnimationRegisterData
{
	//vertex animation data
	public weightsIndex:number;
	public poseIndices:Array<number>;
	
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

	private indexDictionary:Object = new Object();

	constructor()
	{
	}

	public reset(registerCache:ShaderRegisterCache, sharedRegisters:ShaderRegisterData, needVelocity:boolean):void
	{
		this.rotationRegisters = new Array<ShaderRegisterElement>();
		this.positionAttribute = sharedRegisters.animatableAttributes[0];
		this.scaleAndRotateTarget = sharedRegisters.animationTargetRegisters[0];

		for (var i:number = 1; i < sharedRegisters.animationTargetRegisters.length; i++)
			this.rotationRegisters.push(sharedRegisters.animationTargetRegisters[i]);
		
		//allot const register
		this.vertexZeroConst = registerCache.getFreeVertexConstant();
		this.vertexZeroConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 0);
		this.vertexOneConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 1);
		this.vertexTwoConst = new ShaderRegisterElement(this.vertexZeroConst.regName, this.vertexZeroConst.index, 2);

		//allot temp register
		this.positionTarget = registerCache.getFreeVertexVectorTemp();
		registerCache.addVertexTempUsages(this.positionTarget, 1);
		this.positionTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);

		if (needVelocity) {
			this.velocityTarget = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(this.velocityTarget, 1);
			this.velocityTarget = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index);
			this.vertexTime = new ShaderRegisterElement(this.velocityTarget.regName, this.velocityTarget.index, 3);
			this.vertexLife = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index, 3);
		} else {
			var tempTime:ShaderRegisterElement = registerCache.getFreeVertexVectorTemp();
			registerCache.addVertexTempUsages(tempTime, 1);
			this.vertexTime = new ShaderRegisterElement(tempTime.regName, tempTime.index, 0);
			this.vertexLife = new ShaderRegisterElement(tempTime.regName, tempTime.index, 1);
		}

	}

	public setUVSourceAndTarget(sharedRegisters:ShaderRegisterData):void
	{
		this.uvVar = sharedRegisters.uvTarget;
		this.uvAttribute = sharedRegisters.uvSource;
		//uv action is processed after normal actions,so use offsetTarget as uvTarget
		this.uvTarget = new ShaderRegisterElement(this.positionTarget.regName, this.positionTarget.index);
	}

	public setRegisterIndex(node:AnimationNodeBase, parameterIndex:number, registerIndex:number):void
	{
		//8 should be enough for any node.
		var t:Array<number> = this.indexDictionary[node.id];

		if (t == null)
			t = this.indexDictionary[node.id] = new Array<number>(8);

		t[parameterIndex] = registerIndex;
	}

	public getRegisterIndex(node:AnimationNodeBase, parameterIndex:number):number
	{
		return (<Array<number>> this.indexDictionary[node.id])[parameterIndex];
	}
}