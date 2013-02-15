#pragma strict

function Start () {

}

function Update () 
{
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
		transform.localPosition = Vector3(0,3.206,14.995);
	}
}