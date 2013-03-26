#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;

private var xRate : float;
private var yRate : float;
private var zRate : float;
private var camVelocity : Vector3;
private var camPosOld : Vector3;
private var cont : boolean;

function Start () 
{
	//get drag controls script
	dragControls = Camera.main.GetComponent(DragControlsPC);
	
	//init
	camPosOld = Camera.main.transform.position;
}

function Update () 
{
	//get velocity of camera
	camVelocity = Camera.main.transform.position - camPosOld;
	camPosOld = Camera.main.transform.position;
	//print(camVelocity);
}

function MoveAwayFromPlanets()
{
	MoveTo(0.2, Camera.main.transform.position);
}

function MoveToPlanets()
{
	MoveTo(0.2, Camera.main.transform.position);
}

function MoveTo(time : float, target : Vector3)
{
	//set rates and get start time
	xRate = (target.x - transform.position.x) / (time);
	yRate = (target.y - transform.position.y) / (time);
	zRate = (target.z - transform.position.z) / (time);
	cont = true;
	
	//move stuff
	if (transform.position.z > target.z) //zooming out to world view
	{
		do
		{
			if ((transform.position.z + (zRate * Time.deltaTime)) < target.z)
			{
				cont = false;
			}
			else
			{
				transform.position.x += xRate * Time.deltaTime;
				transform.position.y += yRate * Time.deltaTime;
				transform.position.z += zRate * Time.deltaTime;
			}
			yield;
		} while (cont);
		transform.position = target;
		return;
	}
	if (transform.position.z < target.z) //zooming in to play view
	{
		do
		{
			if ((transform.position.z + (zRate * Time.deltaTime)) > target.z)
			{
				cont = false;
			}
			else
			{
				transform.position.x += xRate * Time.deltaTime;
				transform.position.y += yRate * Time.deltaTime;
				transform.position.z += zRate * Time.deltaTime;
			}
			yield;
		} while (cont);
		transform.position = target;
		return;
	}
}