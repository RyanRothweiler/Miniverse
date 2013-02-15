#pragma strict

//public vars
public var radiiSize : float;
public var check : boolean;
public var shrinkSpeed : float;
public var dead = false; //if the sun is alive or not

//private vars
private var RealShrinkSpeed : float; //the saved shrink speed
private var dragControls : DragControlsPC;

function Start () 
{
	//init
	RealShrinkSpeed = shrinkSpeed; 
	
	//get drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//animation pausing
	if (!dragControls.LevelPaused)
	{
		shrinkSpeed = RealShrinkSpeed;
	}
	else
	{
		shrinkSpeed = 0;
	}
}