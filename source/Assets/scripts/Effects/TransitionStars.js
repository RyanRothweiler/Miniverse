#pragma strict

function Start () 
{

}

function Update () 
{
	//parent to camera
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
}