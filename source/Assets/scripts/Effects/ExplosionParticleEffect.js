#pragma strict

private var DragControls : DragControlsPC;
private var first : boolean;
private var objectList : Component[];
private var i : int;

function Start () 
{
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
	first = false;
}

function Update () 
{
	if (!DragControls.LevelPaused)
	{
		//start all animations in children
		if (!first)
		{
			first = true;
			
			objectList = GetComponentsInChildren(ParticleSystem); //get all particle effects
			for (i = 0; i < objectList.length; i++)
			{
				objectList[i].particleSystem.Play();
			}
		}
	}
	else
	{
		//stop all animations and particle effects in children
		if (first)
		{
			first = false;
			
			objectList = GetComponentsInChildren(ParticleSystem); //get all particle effects
			for (i = 0; i < objectList.length; i++)
			{
				objectList[i].particleSystem.Pause();
			}
		}
	}
}