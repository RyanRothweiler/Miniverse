#pragma strict

//create 
//@script RequireComponent(MeshFilter)
//@script RequireComponent(MeshRenderer)

//public vars
public var SunRadiiHolder : GameObject;
public var combine : boolean;
public var circles : MeshCircle[]; //holds all sun radii circles
public var dummyTriangles : int[]; //a dummy list holding the new list of vertices
public var dumTris = new List.<int>(); 
public var vertsToRemove = new List.<int>(); //list of vertices to remove from the circle

var masterTris : int[]; //a dummy list holding the new list of vertices
var masterNors : Vector3[]; 
var masterVerts : Vector3[];
var objects : GameObject[];
var chains = new Array(); //holds all the chains in the level

public var removeArr = new Array();
public var DeathSphere : GameObject; 

//private vars
private var circleRadii : float; //radius of the circle. retreived before combining the meshes
private var count : int; //generic count
private var d : float; //generic d variable (the distance) used for calculating intersecting points
private var x : float; //generic x variable (the x location) used for calculating intersecting points
private var a : float; //generic a variable (the distance between the two points) used for calculating intersecting points
private var i : int;

private var tempChain : CircleChain;
private var tempMeshCircle : MeshCircle;

private var cont : boolean; //general continue variable

function Start () 
{
	//organize all the circles and parent them to this object
	objects = GameObject.FindGameObjectsWithTag("SunChainCircle");
	for (var circle : GameObject in objects) 
	{
		circle.transform.parent = this.transform;
	}
	
	//init
	dummyTriangles = new int[108];
	
	//create master mesh data
	masterTris = transform.GetChild(0).GetComponent(MeshFilter).mesh.triangles.Clone();
	masterNors = transform.GetChild(0).GetComponent(MeshFilter).mesh.normals.Clone();
	masterVerts = transform.GetChild(0).GetComponent(MeshFilter).mesh.vertices.Clone();
	
	//combine the meshes
	if (combine)
	{
		MeshAdd();
	}
}

function Update () 
{
//	//combine the meshes
//	if (combine)
//	{
//		MeshAdd();
//	}
}

//add all child meshes into one and delete internal points
function MeshAdd ()
{
	//reset
	count = 0;
	chains.Clear();
		
	//get information about all circles
	circles = new MeshCircle[GetComponentsInChildren(MeshFilter).Length];
	for (var child : Transform in transform)
	{
		circles[count] = new MeshCircle(child.GetComponent(MeshFilter).mesh.vertices[0].y * child.transform.localScale.x, transform.TransformPoint(child.position), child.GetComponent(MeshFilter));
		circles[count].mesh.mesh.Clear();
		circles[count].mesh.mesh.vertices = masterVerts;
		circles[count].mesh.mesh.normals = masterNors;
		circles[count].mesh.mesh.triangles = masterTris;
		count++;
	}
	
	//mark the end circles
	for (var circle1 : MeshCircle in circles)
	{
		for (var circle2 : MeshCircle in circles)
		{
			d = Vector3.Distance(circle2.center, circle1.center); //find distance
			//check if they intersect at all and the two circles are not the same
			if ((circle1.circle.radius + circle2.circle.radius > d) && (circle1 != circle2))
			{
				//this is used only for making the end points
				if (circle1.hitOnce && !circle1.hitTwice)
				{
					circle1.hitTwice = true;
				}
				if (!circle1.hitOnce)
				{
					circle1.hitOnce = true;
				}
			}
		}
	}
	for (var circle : MeshCircle in circles)
	{
		if (circle.hitOnce && !circle.hitTwice)
		{
			circle.endCircle = true;
		}
	}
	
	//go through the circles, find an endpoint, create a chain and revoke the circles endpoint status (its still an endpoint but I don't want to make a duplicate chain)
	for (var circle : MeshCircle in circles)
	{
		//if found an end point
		if (circle.endCircle)
		{
			circle.endCircle = false;
			//create a chain
			chains.Add(CircleChain(circle, null, SunRadiiHolder));
			tempChain = chains[chains.Count - 1];

			//start chain
			tempChain.members.Add(circle);
			//find the next link
			for (var circle2 : MeshCircle in circles)
			{
				d = Vector3.Distance(circle2.circle.center, circle.circle.center); //find distance
				//check if they intersect at all and the two circles are not the same
				if ((circle.circle.radius + circle2.circle.radius > d) && (circle != circle2))
				{
					tempChain.members.Add(circle2);
					SetNextMember(chains[chains.Count - 1], circle2);
				}
			}
		}
	}
	//set end circles... again
	for (var circle : MeshCircle in circles)
	{
		if (circle.hitOnce && !circle.hitTwice)
		{
			circle.endCircle = true;
		}
	}
	
	//splice together all chains
	for (i = 0; i < chains.Count; i++)
	{
		tempChain = chains[i];
		tempChain.SpliceTogether(DeathSphere);
	}
	
	//disable circles
	for (var circle : MeshCircle in	 circles)
	{
		if (circle.collides)
		{
			Destroy(circle.mesh.gameObject);
		}
	}
}

//assigns the next member in the chain
function SetNextMember(chain : CircleChain, currentCircle : MeshCircle) : boolean
{
	for (var circle : MeshCircle in circles)
	{
		d = Vector3.Distance(currentCircle.circle.center, circle.circle.center); //find distance
		//check if they intersect at all and the two circles are not the same
		if ((currentCircle.circle.radius + circle.circle.radius > d) && (currentCircle != circle) && (circle != chain.members[chain.members.Count - 2]))
		{			
			chain.members.Add(circle);
			if (circle.endCircle)
			{
				chain.endCircle2 = circle;
				circle.endCircle = false;
				break;
			}
			else
			{
				SetNextMember(chain, circle);
				break;
			}
		}
	}
	currentCircle.endCircle = false;
	return true;
}