#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;
private var anim : Animation;

function Start () 
{
	//get objects
	dragControls = Camera.main.GetComponent(DragControlsPC);
	anim = transform.Find("Model/humanPerson_MO").animation;
}

function Update () 
{
	//animation pausing
	if (!dragControls.LevelPaused)
	{
		anim["Default Take"].speed = 1;
	}
	else
	{
		anim["Default Take"].speed = 0;
	}
}