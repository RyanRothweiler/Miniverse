#pragma strict

//public vars

//private var
private var dragControls : DragControlsPC;


function Start () 
{
	//get things
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
}