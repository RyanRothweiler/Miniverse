#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;

function Start () 
{
	//get drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//stay parented
	if (transform.parent == null && !dragControls.levelWon)
	{
		transform.parent = Camera.main.transform;
	}
	
	//unparenting on level win
	if (dragControls.levelWon)
	{
		transform.parent == null;
	}
}