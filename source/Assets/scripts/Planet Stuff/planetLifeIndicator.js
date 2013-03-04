#pragma strict

//public vars
public var xPercentage = 0.0; //the value which drives the color and animation. stay between 0 and 100. Used as percentege. 
public var degradationSpeed = 0.0; //the speed which the planet degrades... hence the name.

public var dead = false;

public var PlanetExplosion : GameObject;
public var shader : Shader;

//private vars
private var x = 0.0;
private var fadeTime = 0.0;
private var first = true;
private var DragControls : DragControlsPC;


function Start ()
{
	//create a material
	GetComponentInChildren(Renderer).material = new Material (shader);
	//GetComponentInChildren(Renderer).material.renderQueue = 8000;
	
	//set material color based on degradation speed
	if (degradationSpeed >= 35) //red
	{
		GetComponentInChildren(Renderer).material.SetColor("_MainColor",Color(255,0,0));
	}
	if (degradationSpeed >= 15 && degradationSpeed < 35) //yellow
	{
		GetComponentInChildren(Renderer).material.SetColor("_MainColor",Color(255,255,0));
	}
	if (degradationSpeed >= 0 && degradationSpeed < 15) //green
	{
		GetComponentInChildren(Renderer).material.SetColor("_MainColor",Color(0,255,0));
	}
		
	//get drag controls script
	DragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//if the level is not paused
	if (!DragControls.LevelPaused)
	{
		//degrade the planet
		if (transform.parent.GetComponent(PlanetSearcher) != null)
		{
			if (!dead && !(transform.parent.GetComponent(PlanetSearcher).controlled))
				xPercentage += degradationSpeed * Time.deltaTime;
		}
		
		//limit xPercentage
		xPercentage = Mathf.Clamp(xPercentage, 0.0,100.0);
		
		//set animation frame
		animation["ArmatureAction"].time = (animation["ArmatureAction"].length * (xPercentage / 100));
		
			//if percentage is at 100 then the planet is dead
		if (xPercentage >= 100 && !dead)
		{
			//create explosion
			GameObject.Instantiate(PlanetExplosion, transform.position, Quaternion(0,0,0,0)); 
			
			//disable mesh renderers
			var renderers = transform.parent.GetComponentsInChildren(Renderer);
			for (var rendar : Renderer in renderers)
			{
				rendar.enabled = false;
			}
			//if people on that planet then level is over
			if (renderers.Length > 6)
			{
				DragControls.LevelLose();
			}
				
			//is dead... pay for funeral later		
			dead = true;
			
			//disable thie collider
			transform.parent.collider.enabled = false;
			
			//disable select line
			transform.parent.GetComponent(PlanetSearcher).selectLine.transform.parent = null;
			transform.parent.GetComponent(PlanetSearcher).selectLine.GetComponentInChildren(MeshRenderer).enabled = false;  
		}
	}
	else //else pause the animations
	{
		animation["ArmatureAction"].speed = 0;
	}
}