#pragma strict

//public vars
public var RadiiMatObj : GameObject; //the game object which holds the radii ring material
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
	
	//initialize the sun raii color
	if (shrinkSpeed >= 4) //red
	{
		RadiiMatObj.renderer.material.color = Color(255,0,0);
		RadiiMatObj.renderer.material.color.a = 0.2;
	}
	if (shrinkSpeed >= 2 && shrinkSpeed < 4) //yellow
	{
		RadiiMatObj.renderer.material.color = Color(255,255,0);
		RadiiMatObj.renderer.material.color.a = 0.2;
	}
	if (shrinkSpeed >= 1 && shrinkSpeed < 2) //green
	{
		RadiiMatObj.renderer.material.color = Color(0,255,0);
		RadiiMatObj.renderer.material.color.a = 0.2;
	}
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