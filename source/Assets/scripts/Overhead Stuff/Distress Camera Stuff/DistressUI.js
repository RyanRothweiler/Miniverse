#pragma strict

//public vars

//private var

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