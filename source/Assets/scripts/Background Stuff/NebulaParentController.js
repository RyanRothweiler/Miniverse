#pragma strict
public static var savedPos = Vector3(39,-20,134);

function Start () 
{
	//set position
	transform.localPosition = savedPos;

}

function Update () 
{
	//save last post
	if (transform.parent != null)
	{
		savedPos = transform.localPosition;
	}
}