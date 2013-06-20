/// <reference path="../math/Matrix3D.ts" />
/// <reference path="../base/IMaterialOwner.ts" />
module away3d.core.base
{
	//import away3d.cameras.Camera3D;
	//import away3d.core.managers.Stage3DProxy;
	//import away3d.entities.Entity;

	//import flash.display3D.IndexBuffer3D;
	//import flash.geom.Matrix;
	//import flash.geom.Matrix3D;

	/**
	 * IRenderable provides an interface for objects that can be rendered in the rendering pipeline.
	 */
	export interface IRenderable extends away3d.core.base.IMaterialOwner
	{
		/**
		 * The transformation matrix that transforms from model to world space.
		 */
		sceneTransform : away3d.core.math.Matrix3D;

		/**
		 * The transformation matrix that transforms from model to world space, adapted with any special operations needed to render.
		 * For example, assuring certain alignedness which is not inherent in the scene transform. By default, this would
		 * return the scene transform.
		 */
        // TODO: implement Camera3D
		//function getRenderSceneTransform(camera : Camera3D) :  away3d.core.math.Matrix3D;

		/**
		 * The inverse scene transform object that transforms from world to model space.
		 */
        inverseSceneTransform :  away3d.core.math.Matrix3D;

		/**
		 * Indicates whether the IRenderable should trigger mouse events, and hence should be rendered for hit testing.
		 */
        mouseEnabled : boolean;

		/**
		 * The entity that that initially provided the IRenderable to the render pipeline.
		 */
		sourceEntity : Entity;

		/**
		 * Indicates whether the renderable can cast shadows
		 */
		castsShadows : boolean;

		uvTransform : away3d.core.math.Matrix3D;

		shaderPickingDetails : boolean;

		/**
		 * The total amount of vertices in the SubGeometry.
		 */
		numVertices : number /*uint*/;

		/**
		 * The amount of triangles that comprise the IRenderable geometry.
		 */
		numTriangles : number /*uint*/;

		/**
		 * The number of data elements in the buffers per vertex.
		 * This always applies to vertices, normals and tangents.
		 */
		vertexStride : number /*uint*/;

		/**
		 * Assigns the attribute stream for vertex positions.
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function activateVertexBuffer(index : int, stage3DProxy : Stage3DProxy) : void;


		/**
		 * Assigns the attribute stream for UV coordinates
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function activateUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void;

		/**
		 * Assigns the attribute stream for a secondary set of UV coordinates
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function activateSecondaryUVBuffer(index : int, stage3DProxy : Stage3DProxy) : void;

		/**
		 * Assigns the attribute stream for vertex normals
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function activateVertexNormalBuffer(index : int, stage3DProxy : Stage3DProxy) : void;

		/**
		 * Assigns the attribute stream for vertex tangents
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function activateVertexTangentBuffer(index : int, stage3DProxy : Stage3DProxy) : void;

		/**
		 * Retrieves the IndexBuffer3D object that contains triangle indices.
		 * @param context The Context3D for which we request the buffer
		 * @return The VertexBuffer3D object that contains triangle indices.
		 */
        // TODO: implement WebGL3DProxy ( change from Stage3DProxy )
		//function getIndexBuffer(stage3DProxy : Stage3DProxy) : IndexBuffer3D;

		/**
		 * Retrieves the object's vertices as a Number array.
		 */
		vertexData : number[];

		/**
		 * Retrieves the object's normals as a Number array.
		 */
		vertexNormalData : number[];

		/**
		 * Retrieves the object's tangents as a Number array.
		 */
		vertexTangentData : number[];

		/**
		 * Retrieves the object's indices as a uint array.
		 */
		indexData : number[];

		/**
		 * Retrieves the object's uvs as a Number array.
		 */
		UVData : number[];
	}
}