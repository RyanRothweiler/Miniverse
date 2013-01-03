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
		animation["Default Take"].speed = 1;
	}
	else
	{
		animation["Default Take"].speed = 0;
	}
}