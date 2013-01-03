#pragma strict

//public vars

//private vars
private var RotVector : Vector3;
private var DragControls : DragControlsPC;

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	
	//create rotate vector
	RotVector = Vector3(Random.Range(0,0.1),Random.Range(0,0.1),Random.Range(0,0.1));
	
	//initialize planet rotation
	transform.rotation = Quaternion(Random.Range(0,90), Random.Range(0,90), Random.Range(0,90), Random.Range(0,90));
}

function Update () 
{
	//rotate the planet
	if (!DragControls.LevelPaused)
	{
		transform.Rotate(RotVector);
	}
}