#pragma strict

//public vars
public var Distressed : boolean;
public var zPos = 3;
public var DistressUI : GameObject;

//private vars
private var distressedObj : GameObject;
private var dragControls : DragControlsPC;

private var i : int;

private var fVector : Vector3;
private var lookAtPos : Vector3; //the moving position target for the porximity indicator to look

private var planes : Plane[];

function Start () 
{
	//init
	Distressed = false;
	
	//get drag controls script
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//detect distress
	for (i = 0; i < dragControls.worldObjects.length; i++)
	{
		if (dragControls.worldObjects[i].name != "humanShip")
		{
			//check planet life first
			if (dragControls.worldObjects[i].transform.Find("planetShrinkingEffect").GetComponent(planetLifeIndicator).degradationSpeed > 0 && dragControls.worldObjects[i].transform.Find("planetShrinkingEffect").GetComponent(planetLifeIndicator).xPercentage > 10)
			{
				distressedObj = dragControls.worldObjects[i];
				Distress();
				return;
			}
		}
	}
}

function Distress()
{
	//initialize distress
	if (!Distressed)
	{
		Distressed = true;
		ShowMiniMap();
	}
	
	//point arrow
	if (DistressUI.transform.Find("DistressArrow").transform.localEulerAngles.y > 100) //get the up vector
	{
	    fVector = Vector3(1,0,0);
	}
	else
	{
	 	fVector = Vector3(-1,0,0);
	}
	lookAtPos = Vector3(distressedObj.transform.position.x, distressedObj.transform.position.y, DistressUI.transform.Find("DistressArrow").transform.position.z); //change look at target
	DistressUI.transform.Find("DistressArrow").transform.LookAt(lookAtPos,fVector); //point the arrow
	
	//check if the distressed object is on screen
	planes = GeometryUtility.CalculateFrustumPlanes(Camera.main); //get planes
	if(GeometryUtility.TestPlanesAABB(planes,distressedObj.collider.bounds))
	{
		Distressed = false;
	    HideMiniMap();
	}
}

function ShowMiniMap() //shows the mini map
{
	//show camera
	this.camera.enabled = true;
	transform.position = distressedObj.transform.position;
	transform.position.z = zPos;
	
	//setup mini map ui
	DistressUI.transform.Find("DistressCircle").renderer.enabled = true;
	DistressUI.transform.Find("DistressArrow/DistressArrow_model").renderer.enabled = true;
}

function HideMiniMap() //hides the mini map... duh.
{
	//yield WaitForSeconds(0.3);
	//hide camera
	this.camera.enabled = false;
	
	//hide map ui
	DistressUI.transform.Find("DistressCircle").renderer.enabled = false;
	DistressUI.transform.Find("DistressArrow/DistressArrow_model").renderer.enabled = false;
}