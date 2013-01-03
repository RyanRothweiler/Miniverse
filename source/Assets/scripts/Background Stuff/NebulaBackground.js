#pragma strict

private var DragControls : DragControlsPC;
public var AnimSpeed = 0.03;

//keep animation frame
static var AnimFrame : int;

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	
	//set animation frame and speed
	animation["Default Take"].speed = AnimSpeed;
	animation["Default Take"].time = AnimFrame;
}

function Update () 
{
	if (!DragControls.LevelPaused)
	{
		animation["Default Take"].speed = AnimSpeed;
	}
	else
	{
		animation["Default Take"].speed = 0;
	}
	
	//update frame
	AnimFrame = animation["Default Take"].time;
}