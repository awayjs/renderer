import AttributesBuffer					= require("awayjs-core/lib/attributes/AttributesBuffer");
import Matrix3DUtils					= require("awayjs-core/lib/geom/Matrix3DUtils");

import DisplayObjectContainer			= require("awayjs-display/lib/containers/DisplayObjectContainer");
import Geometry							= require("awayjs-display/lib/base/Geometry");
import TriangleSubGeometry				= require("awayjs-display/lib/base/TriangleSubGeometry");
import Mesh								= require("awayjs-display/lib/entities/Mesh");
import MaterialBase						= require("awayjs-display/lib/materials/MaterialBase");

/**
 *  Class Merge merges two or more static meshes into one.<code>Merge</code>
 */
class Merge
{

	//private const LIMIT:uint = 196605;
	private _objectSpace:boolean;
	private _keepMaterial:boolean;
	private _disposeSources:boolean;
	private _geomVOs:Array<GeometryVO>;
	private _toDispose:Array<Mesh>;

	/**
	 * @param    keepMaterial    [optional]    Determines if the merged object uses the recevier mesh material information or keeps its source material(s). Defaults to false.
	 * If false and receiver object has multiple materials, the last material found in receiver submeshes is applied to the merged submesh(es).
	 * @param    disposeSources  [optional]    Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
	 * If true, only receiver geometry and resulting mesh are kept in  memory.
	 * @param    objectSpace     [optional]    Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
	 */
	constructor(keepMaterial:boolean = false, disposeSources:boolean = false, objectSpace:boolean = false)
	{
		this._keepMaterial = keepMaterial;
		this._disposeSources = disposeSources;
		this._objectSpace = objectSpace;
	}

	/**
	 * Determines if the mesh and geometry source(s) used for the merging are disposed. Defaults to false.
	 */
	public set disposeSources(b:boolean)
	{
		this._disposeSources = b;
	}

	public get disposeSources():boolean
	{
		return this._disposeSources;
	}

	/**
	 * Determines if the material source(s) used for the merging are disposed. Defaults to false.
	 */
	public set keepMaterial(b:boolean)
	{
		this._keepMaterial = b;
	}

	public get keepMaterial():boolean
	{
		return this._keepMaterial;
	}

	/**
	 * Determines if source mesh(es) is/are merged using objectSpace or worldspace. Defaults to false.
	 */
	public set objectSpace(b:boolean)
	{
		this._objectSpace = b;
	}

	public get objectSpace():boolean
	{
		return this._objectSpace;
	}

	/**
	 * Merges all the children of a container into a single Mesh. If no Mesh object is found, method returns the receiver without modification.
	 *
	 * @param    receiver           The Mesh to receive the merged contents of the container.
	 * @param    objectContainer    The DisplayObjectContainer holding the meshes to be mergd.
	 *
	 * @return The merged Mesh instance.
	 */
	public applyToContainer(receiver:Mesh, objectContainer:DisplayObjectContainer)
	{
		this.reset();

		//collect container meshes
		this.parseContainer(receiver, objectContainer);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	/**
	 * Merges all the meshes found in the Array&lt;Mesh&gt; into a single Mesh.
	 *
	 * @param    receiver    The Mesh to receive the merged contents of the meshes.
	 * @param    meshes      A series of Meshes to be merged with the reciever mesh.
	 */
	public applyToMeshes(receiver:Mesh, meshes:Array<Mesh>)
	{
		this.reset();

		if (!meshes.length)
			return;

		//collect meshes in vector
		for (var i:number /*uint*/ = 0; i < meshes.length; i++)
			if (meshes[i] != receiver)
				this.collect(meshes[i], this._disposeSources);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	/**
	 *  Merges 2 meshes into one. It is recommand to use apply when 2 meshes are to be merged. If more need to be merged, use either applyToMeshes or applyToContainer methods.
	 *
	 * @param    receiver    The Mesh to receive the merged contents of both meshes.
	 * @param    mesh        The Mesh to be merged with the receiver mesh
	 */
	public apply(receiver:Mesh, mesh:Mesh)
	{
		this.reset();

		//collect mesh
		this.collect(mesh, this._disposeSources);

		//collect receiver
		this.collect(receiver, false);

		//merge to receiver
		this.merge(receiver, this._disposeSources);
	}

	private reset()
	{
		this._toDispose  = new Array<Mesh>();
		this._geomVOs = new Array<GeometryVO>();
	}

	private merge(destMesh:Mesh, dispose:boolean)
	{
		var i:number /*uint*/;
		var subIdx:number /*uint*/;
		var oldGeom:Geometry;
		var destGeom:Geometry;
		var useSubMaterials:boolean;

		oldGeom = destMesh.geometry;
		destGeom = destMesh.geometry = new Geometry();
		subIdx = destMesh.subMeshes.length;

		// Only apply materials directly to sub-meshes if necessary,
		// i.e. if there is more than one material available.
		useSubMaterials = (this._geomVOs.length > 1);

		for (i = 0; i < this._geomVOs.length; i++) {
			var s:number /*uint*/;
			var data:GeometryVO;
			var sub:TriangleSubGeometry = new TriangleSubGeometry(new AttributesBuffer());
			sub.autoDeriveNormals = false;
			sub.autoDeriveTangents = false;

			data = this._geomVOs[i];
			sub.setIndices(data.indices);
			sub.setPositions(data.vertices);
			sub.setNormals(data.normals);
			sub.setTangents(data.tangents);
			sub.setUVs(data.uvs);

			destGeom.addSubGeometry(sub);

			if (this._keepMaterial && useSubMaterials)
				destMesh.subMeshes[subIdx].material = data.material;
		}

		if (this._keepMaterial && !useSubMaterials && this._geomVOs.length)
			destMesh.material = this._geomVOs[0].material;

		if (dispose) {
			var m:Mesh;
			var len:number = this._toDispose.length;
			for (var i:number; i < len; i++) {
				m = this._toDispose[i];
				m.geometry.dispose();
				m.dispose();
			}

			//dispose of the original receiver geometry
			oldGeom.dispose();
		}

		this._toDispose = null;
	}

	private collect(mesh:Mesh, dispose:boolean)
	{
		if (mesh.geometry) {
			var subIdx:number /*uint*/;
			var subGeometries:Array<TriangleSubGeometry> = <Array<TriangleSubGeometry>> mesh.geometry.subGeometries;
			var calc:number /*uint*/;
			for (subIdx = 0; subIdx < subGeometries.length; subIdx++) {
				var i:number /*uint*/;
				var len:number /*uint*/;
				var iIdx:number /*uint*/, vIdx:number /*uint*/, nIdx:number /*uint*/, tIdx:number /*uint*/, uIdx:number /*uint*/;
				var indexOffset:number /*uint*/;
				var subGeom:TriangleSubGeometry;
				var vo:GeometryVO;
				var vertices:Array<number>;
				var normals:Array<number>;
				var tangents:Array<number>;
				var ind:Uint16Array, pd:Float32Array, nd:Float32Array, td:Float32Array, ud:Float32Array;

				subGeom = subGeometries[subIdx];
				pd = subGeom.positions.get(subGeom.numVertices);
				nd = subGeom.normals.get(subGeom.numVertices);
				td = subGeom.tangents.get(subGeom.numVertices);
				ud = subGeom.uvs.get(subGeom.numVertices);

				// Get (or create) a VO for this material
				vo = this.getSubGeomData(mesh.subMeshes[subIdx].material || mesh.material);

				// Vertices and normals are copied to temporary vectors, to be transformed
				// before concatenated onto those of the data. This is unnecessary if no
				// transformation will be performed, i.e. for object space merging.
				vertices = (this._objectSpace)? vo.vertices : new Array<number>();
				normals = (this._objectSpace)? vo.normals : new Array<number>();
				tangents = (this._objectSpace)? vo.tangents : new Array<number>();

				// Copy over vertex attributes
				vIdx = vertices.length;
				nIdx = normals.length;
				tIdx = tangents.length;
				uIdx = vo.uvs.length;
				len = subGeom.numVertices;
				for (i = 0; i < len; i++) {
					calc = i*3;

					// Position
					vertices[vIdx++] = pd[calc];
					vertices[vIdx++] = pd[calc + 1];
					vertices[vIdx++] = pd[calc + 2];

					// Normal
					normals[nIdx++] = nd[calc];
					normals[nIdx++] = nd[calc + 1];
					normals[nIdx++] = nd[calc + 2];

					// Tangent
					tangents[tIdx++] = td[calc];
					tangents[tIdx++] = td[calc + 1];
					tangents[tIdx++] = td[calc + 2];

					// UV
					vo.uvs[uIdx++] = ud[i*2];
					vo.uvs[uIdx++] = ud[i*2 + 1];
				}

				// Copy over triangle indices
				indexOffset = (!this._objectSpace)? vo.vertices.length/3 :0;
				iIdx = vo.indices.length;
				len = subGeom.numElements;
				ind = subGeom.indices.get(len);
				for (i = 0; i < len; i++) {
					calc = i*3;
					vo.indices[iIdx++] = ind[calc] + indexOffset;
					vo.indices[iIdx++] = ind[calc + 1] + indexOffset;
					vo.indices[iIdx++] = ind[calc + 2] + indexOffset;
				}

				if (!this._objectSpace) {
					mesh.sceneTransform.transformVectors(vertices, vertices);
					Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, normals, normals);
					Matrix3DUtils.deltaTransformVectors(mesh.sceneTransform, tangents, tangents);

					// Copy vertex data from temporary (transformed) vectors
					vIdx = vo.vertices.length;
					nIdx = vo.normals.length;
					tIdx = vo.tangents.length;
					len = vertices.length;
					for (i = 0; i < len; i++) {
						vo.vertices[vIdx++] = vertices[i];
						vo.normals[nIdx++] = normals[i];
						vo.tangents[tIdx++] = tangents[i];
					}
				}
			}

			if (dispose)
				this._toDispose.push(mesh);
		}
	}

	private getSubGeomData(material:MaterialBase):GeometryVO
	{
		var data:GeometryVO;

		if (this._keepMaterial) {
			var i:number /*uint*/;
			var len:number /*uint*/;

			len = this._geomVOs.length;
			for (i = 0; i < len; i++) {
				if (this._geomVOs[i].material == material) {
					data = this._geomVOs[i];
					break;
				}
			}
		} else if (this._geomVOs.length) {
			// If materials are not to be kept, all data can be
			// put into a single VO, so return that one.
			data = this._geomVOs[0];
		}

		// No data (for this material) found, create new.
		if (!data) {
			data = new GeometryVO();
			data.vertices = new Array<number>();
			data.normals = new Array<number>();
			data.tangents = new Array<number>();
			data.uvs = new Array<number>();
			data.indices = new Array<number /*uint*/>();
			data.material = material;

			this._geomVOs.push(data);
		}

		return data;
	}

	private parseContainer(receiver:Mesh, object:DisplayObjectContainer)
	{
		var child:DisplayObjectContainer;
		var i:number /*uint*/;

		if (object instanceof Mesh && object != (<DisplayObjectContainer> receiver))
			this.collect(<Mesh> object, this._disposeSources);

		for (i = 0; i < object.numChildren; ++i) {
			child = <DisplayObjectContainer> object.getChildAt(i);
			this.parseContainer(receiver, child);
		}
	}
}

export = Merge;

class GeometryVO
{
	public uvs:Array<number>;
	public vertices:Array<number>;
	public normals:Array<number>;
	public tangents:Array<number>;
	public indices:Array<number /*uint*/>;
	public material:MaterialBase;
}
