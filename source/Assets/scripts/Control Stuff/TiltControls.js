#pragma strict

//public vars
public var UseTiltControls : boolean;

//private vars

function Start () 
{

}

function Update () 
{
	if (UseTiltControls)
	{
		print(Input.acceleration);
	}
}