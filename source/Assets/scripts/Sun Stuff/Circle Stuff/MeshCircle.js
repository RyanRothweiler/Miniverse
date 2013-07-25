class MeshCircle
{
	//variables
	var mesh : MeshFilter;
	var center : Vector3;
	var circle : Circ; //the circle bounding this mesh
	var radius : float;
	var collides = false; //if the circle collides with any circle at all
	
	var masterTris : int[]; //a dummy list holding the new list of vertices
	var masterNors : Vector3[]; 
	var masterVerts : Vector3[];
	
	var endPoint1Vertex1 : int;
	var endPoint1Vertex1Loc : Vector3;
	var endPoint1Vertex2 : int; 
	var endPoint1Vertex2Loc : Vector3;
	var endPoint1Spliced = false; //if the endpoint has been spliced to another
	
	var endPoint2Vertex1 : int;
	var endPoint2Vertex1Loc : Vector3;
	var endPoint2Vertex2 : int;
	var endPoint2Vertex2Loc : Vector3;
	var endPoint2Spliced = false; //if the endpoint has been spliced to another
	
	var endPoint3Vertex1 : int;
	var endPoint3Vertex1Loc : Vector3;
	var endPoint3Vertex2 : int; 
	var endPoint3Vertex2Loc : Vector3;
	var endPoint3Spliced = false; //if the endpoint has been spliced to another
	
	var endPoint4Vertex1 : int;
	var endPoint4Vertex1Loc : Vector3;
	var endPoint4Vertex2 : int;
	var endPoint4Vertex2Loc : Vector3;
	var endPoint4Spliced = false; //if the endpoint has been spliced to another
	
	var lineNext : MeshCircle; //the circle intersecting this one which is the next in the chain line
	var hitOnce : boolean; //if the circle intersects with one circle
	var hitTwice : boolean; //if the circle intersects with two circles
	var endCircle : boolean; //if this circle is an endpoint of the chain or not
	
	var i : int;
	var j : int;
	var loopNum : int;
	
	//default constructor
	function MeshCircle(radius : float, center : Vector3, mesh : MeshFilter)
	{
		this.circle = Circ(center, radius);
		this.mesh = mesh;
		this.center = center;
		this.radius = radius;
		this.endCircle = false;
		
		this.masterNors = mesh.mesh.normals;
		this.masterTris = mesh.mesh.triangles;
		this.masterVerts = mesh.mesh.vertices;
		
		//init
		endPoint1Vertex1 = 1000;
		endPoint1Vertex2 = 1000;
		
		endPoint2Vertex1 = 1000;
		endPoint2Vertex2 = 1000;
		
		endPoint3Vertex1 = 1000;
		endPoint3Vertex2 = 1000;
		
		endPoint4Vertex1 = 1000;
		endPoint4Vertex2 = 1000;
	}
	
	//set the endpoint variables using the end point circles
	function SetEndPoints(ObjToCheck : GameObject, otherCircle : MeshCircle, DeathSphere : GameObject)
	{			
		//get endpoints
		for (i = 0; i < 4; i++)
		{
			//find the point
			var smallestDist = 10000.0;
			var smallestPoint = 0;
			for (j = 0; j < ObjToCheck.GetComponent(MeshFilter).mesh.triangles.Length; j++)
			{
				var nextDist = Vector3.Distance(ObjToCheck.transform.TransformPoint(ObjToCheck.GetComponent(MeshFilter).mesh.vertices[ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j]]), otherCircle.center);
				if ((nextDist < smallestDist) && (Vector3.Distance(ObjToCheck.transform.TransformPoint(ObjToCheck.GetComponent(MeshFilter).mesh.vertices[ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j]]), center) < (circle.radius + 0.001)))
				{
					if (endCircle)
					{
						if ((endPoint1Vertex1 == 1000 || endPoint1Vertex2 == 1000 || endPoint2Vertex1 == 1000 || endPoint2Vertex2 == 1000)  && endPoint1Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint1Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint2Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint2Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j])
						{
							smallestDist = nextDist;
							smallestPoint = ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j];
						}
					}
					else
					{
						if ((endPoint1Vertex1 == 1000 || endPoint1Vertex2 == 1000 || endPoint2Vertex1 == 1000 || endPoint2Vertex2 == 1000 || endPoint3Vertex1 == 1000 || endPoint3Vertex2 == 1000 || endPoint4Vertex1 == 1000 || endPoint4Vertex2 == 1000) && endPoint1Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint1Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint2Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint2Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint3Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint3Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint4Vertex1 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j] && endPoint4Vertex2 != ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j])
						{
							smallestDist = nextDist;
							smallestPoint = ObjToCheck.GetComponent(MeshFilter).mesh.triangles[j];
						}
					}
				}
			}
			
			
			//hold and organize the info
			var cont = true;
			if (endPoint1Vertex1 == 1000)
			{
				endPoint1Vertex1 = smallestPoint;
				endPoint1Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
				cont = false;
			}
			if (cont && endPoint1Vertex1 != 1000 && endPoint1Vertex2 == 1000)
			{
				if (Vector3.Distance(ObjToCheck.transform.TransformPoint(endPoint1Vertex1Loc), ObjToCheck.transform.TransformPoint(ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint])) > 0.7)
				{
					endPoint2Vertex1 = smallestPoint;
					endPoint2Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
					cont = false;
				}
				else
				{
					endPoint1Vertex2 = smallestPoint;
					endPoint1Vertex2Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
					cont = false;
				}
			}
			if (cont && endPoint1Vertex2 != 1000 && endPoint2Vertex1 == 1000)
			{
				endPoint2Vertex1 = smallestPoint;
				endPoint2Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
				cont = false;
			}
			if (cont && endPoint2Vertex1 != 1000 && endPoint2Vertex2 == 1000)
			{
				endPoint2Vertex2 = smallestPoint;
				endPoint2Vertex2Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
				cont = false;
			}
			if (!endCircle)
			{
				if (cont && endPoint2Vertex2 != 1000 && endPoint3Vertex1 == 1000)
				{
					endPoint3Vertex1 = smallestPoint;
					endPoint3Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
					cont = false;
				}
				if (cont && endPoint3Vertex1 != 1000 && endPoint3Vertex2 == 1000)
				{
					if (Vector3.Distance(ObjToCheck.transform.TransformPoint(endPoint3Vertex1Loc), ObjToCheck.transform.TransformPoint(ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint])) > 0.7)
					{
						endPoint4Vertex1 = smallestPoint;
						endPoint4Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
						cont = false;
					}
					else
					{
						endPoint3Vertex2 = smallestPoint;
						endPoint3Vertex2Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
						cont = false;
					}
				}
				if (cont && endPoint3Vertex2 != 1000 && endPoint4Vertex1 == 1000)
				{
					endPoint4Vertex1 = smallestPoint;
					endPoint4Vertex1Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
					cont = false;
				}
				if (cont && endPoint4Vertex1 != 1000 && endPoint4Vertex2 == 1000)
				{
					endPoint4Vertex2 = smallestPoint;
					endPoint4Vertex2Loc = ObjToCheck.GetComponent(MeshFilter).mesh.vertices[smallestPoint];
					cont = false;
				}
			}
		}
	}
}