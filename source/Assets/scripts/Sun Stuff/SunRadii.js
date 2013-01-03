#pragma strict

private var DragControls : DragControlsPC;

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (!DragControls.LevelPaused)
	{
		animation["ArmatureAction"].speed = 1;
	}
	else
	{
		animation["ArmatureAction"].speed = 0;
	}
}