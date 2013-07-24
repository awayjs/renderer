///<reference path="../../_definitions.ts"/>

module away.materials
{

	//use namespace arcane;

	/**
	 * DepthMapPass is a pass that writes depth values to a depth map as a 32-bit value exploded over the 4 texture channels.
	 * This is used to render shadow maps, depth maps, etc.
	 */
	export class DepthMapPass extends away.materials.MaterialPassBase
	{
		private _data:number[];
		private _alphaThreshold:number = 0;
		private _alphaMask:away.textures.Texture2DBase;

		/**
		 * Creates a new DepthMapPass object.
		 */
		constructor()
		{
			super();


			this._data = new Array<number>(     1.0, 255.0, 65025.0, 16581375.0,
			                	                1.0/255.0, 1.0/255.0, 1.0/255.0, 0.0,
				                                0.0, 0.0, 0.0, 0.0);

		}
		
		/**
		 * The minimum alpha value for which pixels should be drawn. This is used for transparency that is either
		 * invisible or entirely opaque, often used with textures for foliage, etc.
		 * Recommended values are 0 to disable alpha, or 0.5 to create smooth edges. Default value is 0 (disabled).
		 */
		public get alphaThreshold():number
		{
			return this._alphaThreshold;
		}
		
		public set alphaThreshold(value:number)
		{
			if (value < 0)
            {

                value = 0;

            }
			else if (value > 1)
            {

                value = 1;

            }

			if (value == this._alphaThreshold)
            {

                return;

            }

			
			if (value == 0 || this._alphaThreshold == 0)
            {

                this.iInvalidateShaderProgram();

            }

			
			this._alphaThreshold = value;
            this._data[8] = this._alphaThreshold;

		}

		/**
		 * A texture providing alpha data to be able to prevent semi-transparent pixels to write to the alpha mask.
		 * Usually the diffuse texture when alphaThreshold is used.
		 */
		public get alphaMask():away.textures.Texture2DBase
		{
			return this._alphaMask;
		}
		
		public set alphaMask(value:away.textures.Texture2DBase)
		{
			this._alphaMask = value;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetVertexCode():string
		{
			var code:string = "";
			// project

            /* TODO: AGAL <> GLSL conversion

			code = "m44 vt1, vt0, vc0		\n" +
				"mov op, vt1	\n";
			
			if (this._alphaThreshold > 0)
            {
                this._pNumUsedTextures = 1;
                this._pNumUsedStreams = 2;
				code += "mov v0, vt1\n" +
					"mov v1, va1\n";
				
			}
            else
            {

                this._pNumUsedTextures = 0;
                this._pNumUsedStreams = 1;
				code += "mov v0, vt1\n";

			}
			*/
			return code;
		}
		
		/**
		 * @inheritDoc
		 */
		public iGetFragmentCode(code:string):string
		{
			
			var wrap:string = this._pRepeat? "wrap" : "clamp";
			var filter:string;
			
			if (this._pSmooth){

                filter = this._pMipmap? "linear,miplinear" : "linear";

            }
			else
            {

                filter = this._pMipmap? "nearest,mipnearest" : "nearest";

            }

            // TODO: AGAL<>GLSL
			
			var codeF:string =
				"div ft2, v0, v0.w		\n" +
				"mul ft0, fc0, ft2.z	\n" +
				"frc ft0, ft0			\n" +
				"mul ft1, ft0.yzww, fc1	\n";
			
			if (this._alphaThreshold > 0)
            {

				var format:string;

				switch (this._alphaMask.format)
                {

					case away.display3D.Context3DTextureFormat.COMPRESSED:
						format = "dxt1,";
						break;

					case "compressedAlpha":
						format = "dxt5,";
						break;

					default:
						format = "";

				}

				codeF += "tex ft3, v1, fs0 <2d," + filter + "," + format + wrap + ">\n" +
					"sub ft3.w, ft3.w, fc2.x\n" +
					"kil ft3.w\n";
			}
			
			codeF += "sub oc, ft0, ft1		\n";
			
			return codeF;
		}
		
		/**
		 * @inheritDoc
		 */
		public iRender(renderable:away.base.IRenderable, stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D, viewProjection:away.geom.Matrix3D)
		{
			if (this._alphaThreshold > 0)
            {

                renderable.activateUVBuffer(1, stage3DProxy);

            }

			
			var context:away.display3D.Context3D = stage3DProxy._iContext3D;
			var matrix:away.geom.Matrix3D = away.math.Matrix3DUtils.CALCULATION_MATRIX;

			matrix.copyFrom(renderable.getRenderSceneTransform(camera));
			matrix.append(viewProjection);
			context.setProgramConstantsFromMatrix(away.display3D.Context3DProgramType.VERTEX, 0, matrix, true);
			renderable.activateVertexBuffer(0, stage3DProxy);
			context.drawTriangles(renderable.getIndexBuffer(stage3DProxy), 0, renderable.numTriangles);

		}
		
		/**
		 * @inheritDoc
		 */
		public iActivate(stage3DProxy:away.managers.Stage3DProxy, camera:away.cameras.Camera3D)
		{

			var context:away.display3D.Context3D = stage3DProxy._iContext3D;

			super.iActivate(stage3DProxy, camera);
			
			if ( this._alphaThreshold > 0)
            {

                context.setTextureAt(0, this._alphaMask.getTextureForStage3D(stage3DProxy));
                context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.FRAGMENT, 0, this._data, 3);

			}
            else
            {

                context.setProgramConstantsFromArray(away.display3D.Context3DProgramType.FRAGMENT, 0, this._data, 2);
            }

		}
	}
}
