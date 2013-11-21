///<reference path="../../_definitions.ts"/>
/**
 * @module away.base
 */
module away.base
{
	//import away3d.cameras.Camera3D;
	//import away3d.managers.Stage3DProxy;
	//import away3d.entities.Entity;

	//import flash.display3D.IndexBuffer3D;
	//import flash.geom.Matrix;
	//import flash.geom.Matrix3D;

	/**
	 * @interface away.base.IRenderable
	 */
	/**
	 *
	 * IRenderable provides an interface for objects that can be rendered in the rendering pipeline.
	 */
	export interface IRenderable extends away.base.IMaterialOwner
	{
		/**
		 * The transformation matrix that transforms from model to world space.
		 */
			sceneTransform:away.geom.Matrix3D; // GET

		/**
		 * The transformation matrix that transforms from model to world space, adapted with any special operations needed to render.
		 * For example, assuring certain alignedness which is not inherent in the scene transform. By default, this would
		 * return the scene transform.
		 */
		getRenderSceneTransform(camera:away.cameras.Camera3D):away.geom.Matrix3D;

		/**
		 * The inverse scene transform object that transforms from world to model space.
		 */
			inverseSceneTransform:away.geom.Matrix3D; //GET

		/**
		 * Indicates whether the IRenderable should trigger mouse events, and hence should be rendered for hit testing.
		 */
			mouseEnabled:boolean; //GET

		/**
		 * The entity that that initially provided the IRenderable to the render pipeline.
		 */
			sourceEntity:away.entities.Entity; // GET

		/**
		 * Indicates whether the renderable can cast shadows
		 */
			castsShadows:boolean; //GET

		/**
		 * Provides a Matrix object to transform the uv coordinates, if the material supports it.
		 * For TextureMaterial and TextureMultiPassMaterial, the animateUVs property should be set to true.
		 */
			uvTransform:away.geom.Matrix;//GET

		shaderPickingDetails:boolean;//GET

		/**
		 * The total amount of vertices in the SubGeometry.
		 */
			numVertices:number;//GET

		/**
		 * The amount of triangles that comprise the IRenderable geometry.
		 */
			numTriangles:number;//GET

		/**
		 * The number of data elements in the buffers per vertex.
		 * This always applies to vertices, normals and tangents.
		 */
			vertexStride:number;//GET

		/**
		 * Assigns the attribute stream for vertex positions.
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */

		activateVertexBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy);

		/**
		 * Assigns the attribute stream for UV coordinates
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */

		activateUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy);

		/**
		 * Assigns the attribute stream for a secondary set of UV coordinates
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */

		activateSecondaryUVBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy);

		/**
		 * Assigns the attribute stream for vertex normals
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */

		activateVertexNormalBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy);

		/**
		 * Assigns the attribute stream for vertex tangents
		 * @param index The attribute stream index for the vertex shader
		 * @param stage3DProxy The Stage3DProxy to assign the stream to
		 */

		activateVertexTangentBuffer(index:number, stage3DProxy:away.managers.Stage3DProxy);

		/**
		 * Retrieves the IndexBuffer3D object that contains triangle indices.
		 * @param context The Context3D for which we request the buffer
		 * @return The VertexBuffer3D object that contains triangle indices.
		 */
		getIndexBuffer(stage3DProxy:away.managers.Stage3DProxy):away.display3D.IndexBuffer3D;

		/**
		 * Retrieves the object's vertices as a Number array.
		 */
			vertexData:number[]; //GET

		/**
		 * Retrieves the object's normals as a Number array.
		 */
			vertexNormalData:number[];//GET

		/**
		 * Retrieves the object's tangents as a Number array.
		 */
			vertexTangentData:number[];//GET

		/**
		 * Retrieves the object's indices as a uint array.
		 */
			indexData:number[] /*uint*/
		;//GET

		/**
		 * Retrieves the object's uvs as a Number array.
		 */
			UVData:number[];//GET
	}
}
