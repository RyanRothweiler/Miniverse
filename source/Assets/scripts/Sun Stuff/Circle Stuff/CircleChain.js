class CircleChain
{
	//variables
	public var endCircle1 : MeshCircle;
	public var endCircle2 : MeshCircle;
	public var members = new Array(); //members does include the two endcircles
	public var CombinedMesh : MeshFilter;
	public var parentMesh : MeshFilter;
	public var SunRadiiHolder : GameObject; //the sunRadiiHolder prefab
	
	var i : int;
	var j : int;
	
	var tempMeshCircle : MeshCircle;
	
	public var dumTris = new List.<int>(); 
	public var dumVerts = new List.<Vector3>(); 
	public var vertsToRemove = new List.<int>(); //list of vertices to remove from the circle
	var parentObj : GameObject; //an instance of SunRadiiHolder which holds the mesh of the chain
	
	
	
	function CircleChain(endCircle1 : MeshCircle, endCircle2 : MeshCircle, SunRadiiHolder : GameObject)
	{
		this.endCircle1 = endCircle1;
		this.endCircle2 = endCircle2;
		this.SunRadiiHolder = SunRadiiHolder;
		parentObj = GameObject.Instantiate(SunRadiiHolder, Vector3.zero, Quaternion.identity);
	}
	
	function SpliceTogether(DeathSphere : GameObject)
	{	
		//remove all internal points and set endpoint circles
		for (j = 0; j < members.Count; j++)
		{
			//if member is the first circle
			if (j == 0)
			{
				RemoveInternalPoints(members[j], members[j+1], DeathSphere);
			}
			//if member is not the end and not the beginning
			if (j != 0 && j != members.Count - 1)
			{
				RemoveInternalPoints(members[j], members[j+1], DeathSphere);
				RemoveInternalPoints(members[j], members[j-1], DeathSphere);
			}
			//if member is the last circle
			if (j == members.Count - 1)
			{
				RemoveInternalPoints(members[j], members[j-1], DeathSphere);
			}
		}
			
		//splice together the chain
		
		//combine all the circles together
		var combine : CombineInstance[] = new CombineInstance[members.Count];
		for (i = 0; i < members.Count; i++)
		{
			combine[i].mesh = members[i].mesh.mesh;
			combine[i].transform = members[i].mesh.gameObject.transform.localToWorldMatrix;
			
			//disable member's mesh
//			members[i].mesh.gameObject.GetComponent(MeshRenderer).active = false;
		}
			
		parentMesh = parentObj.GetComponent(MeshFilter);
		parentMesh.mesh.CombineMeshes(combine);
//				
//		//set new endpoints using the CombinedMesh THIS SLOWS THINGS DOWN A LOT OPTIMIZE HERE FIRST
//		for (i = 1; i < members.Count - 1; i++)
//		{
//			members[i].SetEndPoints(parentObj, members[i+1], DeathSphere);
//			members[i].SetEndPoints(parentObj, members[i-1], DeathSphere);
//		}
//		//catch the last circle and the first circle
//		members[members.Count-1].SetEndPoints(parentObj, members[i-1], DeathSphere);
//		members[0].SetEndPoints(parentObj, members[1], DeathSphere);
//		
//		//go through the members to get the information, but actually act on the parentObj mesh
//		for (j = 0; j < members.Count-1	; j++) 
//		{
//			var ds = new Array();
//			if (!members[j].endPoint1Spliced) //this whole entire if statement is probably more complicated than it needs to be
//			{
//				ds.Clear();
//				//find point to splice
//				ds.Add(Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint1Vertex1Loc));
//				ds.Add(Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint2Vertex1Loc));
//				if (members[j+1].endPoint3Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint3Vertex1Loc));
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint4Vertex1Loc));
//				}
//				ds.Sort();
//				//splice mesh
//				if (ds[0] == Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint1Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint1Vertex1, members[j].endPoint1Vertex2], [members[j+1].endPoint1Vertex1, members[j+1].endPoint1Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint1Spliced = true;
//					members[j+1].endPoint1Spliced = true;
//				}
//				if (ds[0] == Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint2Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint1Vertex1, members[j].endPoint1Vertex2], [members[j+1].endPoint2Vertex1, members[j+1].endPoint2Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint1Spliced = true;
//					members[j+1].endPoint2Spliced = true;
//				}
//				if (members[j+1].endPoint3Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint3Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint1Vertex1, members[j].endPoint1Vertex2], [members[j+1].endPoint3Vertex1, members[j+1].endPoint3Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint1Spliced = true;
//					members[j+1].endPoint3Spliced = true;
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint1Vertex1Loc, members[j+1].endPoint4Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint1Vertex1, members[j].endPoint1Vertex2], [members[j+1].endPoint4Vertex1, members[j+1].endPoint4Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint1Spliced = true;
//					members[j+1].endPoint4Spliced = true;
//				}
//			}
//			if (!members[j].endPoint2Spliced) //this whole entire if statement is probably more complicated than it needs to be
//			{
//				ds.Clear();
//				//get mesh to splice
//				ds.Add(Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint1Vertex1Loc));
//				ds.Add(Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint2Vertex1Loc));
//				if (members[j+1].endPoint3Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint3Vertex1Loc));
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint4Vertex1Loc));
//				}
//				ds.Sort();
//				
//				//splice mesh
//				if (ds[0] == Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint1Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint2Vertex1, members[j].endPoint2Vertex2], [members[j+1].endPoint1Vertex1, members[j+1].endPoint1Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint2Spliced = true;
//					members[j+1].endPoint1Spliced = true;
//				}
//				if (ds[0] == Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint2Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint2Vertex1, members[j].endPoint2Vertex2], [members[j+1].endPoint2Vertex1, members[j+1].endPoint2Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint2Spliced = true;
//					members[j+1].endPoint2Spliced = true;
//				}
//				if (members[j+1].endPoint3Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint3Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint2Vertex1, members[j].endPoint2Vertex2], [members[j+1].endPoint3Vertex1, members[j+1].endPoint3Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint2Spliced = true;
//					members[j+1].endPoint3Spliced = true;				
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint2Vertex1Loc, members[j+1].endPoint4Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint2Vertex1, members[j].endPoint2Vertex2], [members[j+1].endPoint4Vertex1, members[j+1].endPoint4Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint2Spliced = true;
//					members[j+1].endPoint4Spliced = true;
//				}
//			}
//			if ((!members[j].endPoint3Spliced) && members[j].endPoint3Vertex1 != 1000) //this whole entire if statement is probably more complicated than it needs to be
//			{
//				ds.Clear();
//				//get mesh to splice
//				ds.Add(Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint1Vertex1Loc));
//				ds.Add(Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint2Vertex1Loc));
//				if (members[j+1].endPoint3Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint3Vertex1Loc));
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint4Vertex1Loc));
//				}
//				ds.Sort();
//				
//				//splice mesh
//				if (ds[0] == Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint1Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint3Vertex1, members[j].endPoint3Vertex2], [members[j+1].endPoint1Vertex1, members[j+1].endPoint1Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint3Spliced = true;
//					members[j+1].endPoint1Spliced = true;
//				}
//				if (ds[0] == Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint2Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint3Vertex1, members[j].endPoint3Vertex2], [members[j+1].endPoint2Vertex1, members[j+1].endPoint2Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint3Spliced = true;
//					members[j+1].endPoint2Spliced = true;
//				}
//				if (members[j+1].endPoint3Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint3Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint3Vertex1, members[j].endPoint3Vertex2], [members[j+1].endPoint3Vertex1, members[j+1].endPoint3Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint3Spliced = true;
//					members[j+1].endPoint3Spliced = true;
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint3Vertex1Loc, members[j+1].endPoint4Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint3Vertex1, members[j].endPoint3Vertex2], [members[j+1].endPoint4Vertex1, members[j+1].endPoint4Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint3Spliced = true;
//					members[j+1].endPoint4Spliced = true;
//				}
//			}
//			if ((!members[j].endPoint4Spliced) && members[j].endPoint4Vertex1 != 1000) //this whole entire if statement is probably more complicated than it needs to be
//			{
//				ds.Clear();
//				//get mesh to splice
//				ds.Add(Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint1Vertex1Loc));
//				ds.Add(Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint2Vertex1Loc));
//				if (members[j+1].endPoint3Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint3Vertex1Loc));
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000)
//				{
//					ds.Add(Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint4Vertex1Loc));
//				}
//				ds.Sort();
//				
//				//splice mesh
//				if (ds[0] == Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint1Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint4Vertex1, members[j].endPoint4Vertex2], [members[j+1].endPoint1Vertex1, members[j+1].endPoint1Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint4Spliced = true;
//					members[j+1].endPoint1Spliced = true;
//				}
//				if (ds[0] == Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint2Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint4Vertex1, members[j].endPoint4Vertex2], [members[j+1].endPoint2Vertex1, members[j+1].endPoint2Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint4Spliced = true;
//					members[j+1].endPoint2Spliced = true;
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint3Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint4Vertex1, members[j].endPoint4Vertex2], [members[j+1].endPoint3Vertex1, members[j+1].endPoint3Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint4Spliced = true;
//					members[j+1].endPoint3Spliced = true;
//				}
//				if (members[j+1].endPoint4Vertex1 != 1000 && ds[0] == Vector3.Distance(members[j].endPoint4Vertex1Loc, members[j+1].endPoint4Vertex1Loc)) 
//				{
//					SpliceMesh([members[j].endPoint4Vertex1, members[j].endPoint4Vertex2], [members[j+1].endPoint4Vertex1, members[j+1].endPoint4Vertex2], parentObj.GetComponent(MeshFilter));
//					members[j].endPoint4Spliced = true;
//					members[j+1].endPoint4Spliced = true;
//				}
//			}
//		}
	}
	
	//removes the points from base circle which are inside otherCircle
	function RemoveInternalPoints(baseCircle : MeshCircle, otherCircle : MeshCircle, DeathSphere : GameObject)
	{
		//create intersection circle
		var intersectCirc = Circ(Vector3.zero, 0);
		var intersectPoints = baseCircle.circle.FindIntersectPoints(otherCircle.circle);
		
		//set intersection circle
		var dx = baseCircle.center.x - otherCircle.center.x; //distance x
		var dy = baseCircle.center.y - otherCircle.center.y; //distance y

		if (baseCircle.center.x > otherCircle.center.x)
		{
			if (baseCircle.center.y > otherCircle.center.y)
			{
				intersectCirc = Circ(Vector3(baseCircle.center.x - (dx/2), baseCircle.center.y - (dy/2), baseCircle.mesh.gameObject.transform.TransformPoint(baseCircle.center).z * -1), ((Vector2.Distance(intersectPoints[0], intersectPoints[1]))/2)+0.02);
			}
			else
			{
				intersectCirc = Circ(Vector3(baseCircle.center.x - (dx/2), baseCircle.center.y - (dy/2), baseCircle.mesh.gameObject.transform.TransformPoint(baseCircle.center).z * -1), ((Vector2.Distance(intersectPoints[0], intersectPoints[1]))/2)+0.02);
			}
		}
		else
		{
			if (baseCircle.center.y > otherCircle.center.y)
			{
				intersectCirc = Circ(Vector3(otherCircle.center.x + (dx/2), otherCircle.center.y + (dy/2), otherCircle.mesh.gameObject.transform.TransformPoint(otherCircle.center).z * -1), ((Vector2.Distance(intersectPoints[0], intersectPoints[1]))/2)+0.02);
			}
			else
			{
				intersectCirc = Circ(Vector3(otherCircle.center.x + (dx/2), otherCircle.center.y + (dy/2), otherCircle.mesh.gameObject.transform.TransformPoint(otherCircle.center).z * -1), ((Vector2.Distance(intersectPoints[0], intersectPoints[1]))/2)+0.02);
			}
		}
		
		intersectCirc.Visualize(DeathSphere);
	
		//copy triangles to dumTris
		dumTris.Clear();
		vertsToRemove.Clear();
		for (x = 0; x < baseCircle.mesh.mesh.triangles.length; x++)
		{
			dumTris.Add(baseCircle.mesh.mesh.triangles[x]);
		}
		
		//go through vertices and save the ones inside the circles s
		for (x = 0; x < baseCircle.mesh.mesh.vertices.length; x++)
		{
			if (intersectCirc.Contains(baseCircle.mesh.transform.TransformPoint(baseCircle.mesh.mesh.vertices[x])))
			{
				vertsToRemove.Add(x);
			}
		}		
		
		//go through triangles and check if the triangle uses one of the vertsToRemove. if so remove the appropriate triangle.
		for (x = 0; x < dumTris.Count; x++)
		{	
			for (i = 0; i < vertsToRemove.Count; i++)
			{
				if (dumTris[x] == vertsToRemove[i])
				{
					//last vert
					if ((x%3) == 1)
					{
						dumTris.RemoveAt((x)-1);
						dumTris.RemoveAt((x)-1);
						dumTris.RemoveAt((x)-1);
					}
					//middle vert
					if ((x%3) == 2)
					{
						dumTris.RemoveAt((x)-2);
						dumTris.RemoveAt((x)-2);
						dumTris.RemoveAt((x)-2);
					}
					//last vert
					if ((x%3) == 0)
					{
						dumTris.RemoveAt((x));
						dumTris.RemoveAt((x));
						dumTris.RemoveAt((x));
					}
					
//					//reset
					i = 0;
					x = 0;
				}
			}
		}
	
		//update model
		dummyTriangles = new int[dumTris.Count];
		for (x = 0; x < dumTris.Count; x++)
		{
			dummyTriangles[x] = dumTris[x];
		}
		//assign new mesh
		baseCircle.mesh.mesh.triangles = dummyTriangles;
	}
	
	//splice the meshes together 
	function SpliceMesh(circle1EndVerts : Object[], circle2EndVerts : Object[], parentMesh : MeshFilter)
	{
		//first make sure the points have been set
		if (circle1EndVerts[0] != 1000 && circle1EndVerts[1] != 1000 && circle2EndVerts[0] != 1000 && circle2EndVerts[1] != 1000)
		{
			//get data and initialize... should probably not do this for every member
			var vertices = new Vector3[parentMesh.mesh.vertices.length + 2];
			var triangles = new int[parentMesh.mesh.triangles.length + 12];
			var uvs = new Vector2[parentMesh.mesh.uv.length + 2];
			for (i = 0; i < parentMesh.mesh.vertices.length; i++)
			{
				vertices[i] = parentMesh.mesh.vertices[i];
			}
			for (i = 0; i < parentMesh.mesh.triangles.length; i++)
			{
				triangles[i] = parentMesh.mesh.triangles[i];
			}
			for (i = 0; i < parentMesh.mesh.uv.length; i++)
			{
				uvs[i] = parentMesh.mesh.uv[i];
			}
		
			var circle1EndVertLocs = [parentMesh.transform.TransformPoint(parentMesh.mesh.vertices[circle1EndVerts[0]]), parentMesh.transform.TransformPoint(parentMesh.mesh.vertices[circle1EndVerts[1]])];
			var circle2EndVertLocs = [parentMesh.transform.TransformPoint(parentMesh.mesh.vertices[circle2EndVerts[0]]), parentMesh.transform.TransformPoint(parentMesh.mesh.vertices[circle2EndVerts[0]])];
			
		
			newPoint1 = Vector3((circle1EndVertLocs[0].x + circle2EndVertLocs[0].x) / 2, (circle1EndVertLocs[0].y + circle2EndVertLocs[0].y) / 2, (circle1EndVertLocs[0].z + circle2EndVertLocs[0].z) / 2);
			newPoint2 = Vector3((circle1EndVertLocs[1].x + circle2EndVertLocs[1].x) / 2, (circle1EndVertLocs[1].y + circle2EndVertLocs[1].y) / 2, (circle1EndVertLocs[1].z + circle2EndVertLocs[1].z) / 2);
		
			
			//create new vertices
			vertices[vertices.length - 1] = newPoint1;
			vertices[vertices.length - 2] = newPoint2;
			
			//create new uvs
			uvs[uvs.length - 1] = Vector2(1, 0);
			uvs[uvs.length - 2] = Vector2(0, 1);
			
			//create triangles
			//one side
			triangles[triangles.length - 1] = vertices.length - 1;
			triangles[triangles.length - 2] = circle1EndVerts[0];	
			triangles[triangles.length - 3] = circle1EndVerts[1];
			triangles[triangles.length - 4] = vertices.length - 1;
			triangles[triangles.length - 5] = vertices.Length - 2;
			triangles[triangles.length - 6] = circle1EndVerts[1];
			//the other side
			triangles[triangles.length - 7] = vertices.length - 1;
			triangles[triangles.length - 8] = circle2EndVerts[0];
			triangles[triangles.length - 9] = circle2EndVerts[1];
			triangles[triangles.length - 10] = vertices.length - 1;
			triangles[triangles.length - 11] = vertices.Length - 2;
			triangles[triangles.length - 12] = circle2EndVerts[1];
			
			//update model
			parentMesh.mesh.Clear();
			
			parentMesh.mesh.vertices = vertices;
			parentMesh.mesh.uv = uvs;
			parentMesh.mesh.triangles = triangles;
		}
		else
		{
			Debug.Log("-----WARNING: Not all the end points have been found. Try wiggling things around a bit. (twss)");
		}
	}
}