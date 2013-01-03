#pragma strict

function Start () 
{

}

function Update () 
{
	//stay parented to the camera
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}

}