#pragma strict

function Start () 
{

}

function Update () 
{
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
}