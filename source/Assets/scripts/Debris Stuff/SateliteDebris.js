#pragma strict

//public vars

//private vars
private var DragControls : DragControlsPC;
private var anim : Animation;

function Start () 
{
	//get thigns
	DragControls = Camera.main.GetComponent(DragControlsPC);
	anim = GetComponentInChildren(Animation);
	
	//initialize things
	anim["Default Take"].speed = 0.15;
}

function Update () 
{
	//rotate the planet
	if (!DragControls.LevelPaused)
	{
		anim["Default Take"].speed = 0.15;
	}
	else
	{
		anim["Default Take"].speed = 0;
	}
}