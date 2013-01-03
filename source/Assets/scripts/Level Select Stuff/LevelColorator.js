#pragma strict

var xmlHandler : XmlHandler;
private var completedPlane : GameObject;


function Update () 
{
	for(var level : Level in xmlHandler.sWorld)
	{
		if(level.lProgress)
		{
			completedPlane = GameObject.Find(level.name);
			completedPlane.SetActiveRecursively(true);
		}
	}
}