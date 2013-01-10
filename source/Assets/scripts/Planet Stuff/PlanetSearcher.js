#pragma strict

//public vars
public var controlled = true; // if the planet has a parent or not
public var Selected = false; //if the planet is selected
public var Alive = true; //if this planet is alive
public var EndLevel = false; //if hit the end level cube
public var Invincible = false; //does exactly what you think it does
public var Draggable = true; //if the planet is draggable or not. used for level select planets
public var nearestPlanet : GameObject;
public var selectLine : GameObject; //everything must have its own select line
public var PlanetExplosion : GameObject; //the explosion prefab

//world 1 boss level phases. Phase 1 is moving up, phase 2 is moving to the right, and phase 3 is moving down
public var Phase1 = false;
public var Phase2 = false;
public var Phase3 = false;
public var StartPhase : int; //the phase which this planet starts
public var NextPlanet : GameObject; //the next planet the player will control for the next phase


//private vars
private var fVector : Vector3;
private var objectPos : Vector3;
private var gameObjects = new Array();
private var nearestDistanceSqr : float; 
private var distanceSqr : float;
private var dummyRect : Rect;
private var first : boolean;
private var indicatorFirstShow = true;
private var indicatorFirstHide = true;
private var i : int;

private var objectList : Component[];

private var found = false;
private var dragControls : DragControlsPC;

// Use this for initialization
function Start () 
{
	//set drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
	first = false;
}

// Update is called once per frame 
function Update () 
{	
	if (!dragControls.LevelPaused)
	{
		//start all animations in children
		if (!first)
		{
			first = true;
			
			objectList = GetComponentsInChildren(Animation); //get all animations
			for (i = 0; i < objectList.length; i++)
			{
				if (objectList[i].animation["Default Take"] == null)
				{
					objectList[i].animation["Anim"].speed = objectList[i].GetComponent(ProximityIndicator).AnimSpeed;
				}
				else
				{
					objectList[i].animation["Default Take"].speed = 1;
				}
			}
			
			objectList = GetComponentsInChildren(ParticleSystem); //get all particle effects
			for (i = 0; i < objectList.length; i++)
			{
				objectList[i].particleSystem.Play();
			}
		}
		
		if (transform.parent == null)
		{
			BeginSearch();
		}
	}
	else
	{
		//stop all animations and particle effects in children
		if (first)
		{
			first = false;
			
			objectList = GetComponentsInChildren(Animation); //get all objects
			for (i = 0; i < objectList.length; i++)
			{
				if (objectList[i].name != "proximityIndicator_2")
				{
					objectList[i].animation["Default Take"].speed = 0;
				}
			}
			
			objectList = GetComponentsInChildren(ParticleSystem); //get all particle effects
			for (i = 0; i < objectList.length; i++)
			{
				objectList[i].particleSystem.Pause();
			}
		}
	}
	
	//update controlled
	if (transform.parent == null)
		controlled = false;
}

//the search if this object is a planet
function BeginSearch ()
{	
	//reset variables
	found = false;
	nearestDistanceSqr = Mathf.Infinity;
    gameObjects = dragControls.worldObjects;
    nearestPlanet = this.gameObject;
    distanceSqr = 0.0;
    objectPos = Vector3.zero;
    

    // loop through each tagged object, remembering nearest one found
    for (var obj : GameObject in gameObjects) 
    {
	    distanceSqr = 0;
	    objectPos = obj.transform.position;
	        
	    //normal objects
		if (obj.transform != this.transform && obj.name != "Asteroid")
		{
		  	distanceSqr = Mathf.Abs((objectPos - transform.position).sqrMagnitude);
		
		   	if (distanceSqr < nearestDistanceSqr && distanceSqr < dragControls.worldDist && !obj.GetComponentInChildren(planetLifeIndicator).dead && !GetComponentInChildren(planetLifeIndicator).dead)
		   	{
		   		nearestPlanet = obj;
				nearestDistanceSqr = distanceSqr;
		       	found = true;
		    }
		}
		    
		//asteroids
		if (obj.transform != this.transform && obj.name == "Asteroid")
		{
		 	objectPos = obj.GetComponent(AsteroidController).AsteroidCenter.transform.position;
		  	distanceSqr = Mathf.Abs((objectPos - transform.position).sqrMagnitude);
		
		   	if (distanceSqr < nearestDistanceSqr && distanceSqr < dragControls.worldDist && !GetComponentInChildren(planetLifeIndicator).dead)
		   	{
		  		nearestPlanet = obj.GetComponent(AsteroidController).AsteroidCenter;
		   		nearestDistanceSqr = distanceSqr;
		   		found = true;
		   	}
		}
	} 
	
	//if found the closest planet then do this
	if (found)
	{
		if (indicatorFirstShow)
		{
			indicatorFirstShow = false;
			indicatorFirstHide = true;
			selectLine.GetComponentInChildren(ProximityIndicator).Show();
		}
		//point the indicator
	    selectLine.transform.position = this.transform.position;
	    if(selectLine.transform.localEulerAngles.y > 100)
	    {
	       	fVector = Vector3(0,0,1);
	    }
	    else
	    {
	     	fVector = Vector3(0,0,-1);
	    }
	    
	    //point selector at planet
	    if(nearestPlanet.name == "humanShip")
	    {
	    	selectLine.transform.LookAt(nearestPlanet.transform.Find("humanship_3_MO").position,fVector);
	    }
	    else
	    {
	    	selectLine.transform.LookAt(nearestPlanet.transform,fVector);
	    }
	}
	else
	{
		//turn off select line
		if (indicatorFirstHide)
		{
			selectLine.GetComponentInChildren(ProximityIndicator).Hide();
			indicatorFirstShow = true;
			indicatorFirstHide = false;
		}
	}
	
	//world 1 boss level end phase checking
	if (NextPlanet != null)
	{
		if (Camera.main.transform.position.y >= NextPlanet.transform.position.y && Phase1) //phase 1
		{
			//set up the next planet
			NextPlanet.GetComponent(planetLifeIndicator).degradationSpeed = 3;
			NextPlanet.transform.parent.GetComponent(PlanetSearcher).Invincible = false;
			
			StartPhase = 1000;
			Phase1 = false;
		}
		if (Camera.main.transform.position.x >= NextPlanet.transform.position.x && Phase2) //phase 2
		{
			//set up the next planet
			NextPlanet.GetComponent(planetLifeIndicator).degradationSpeed = 3;
			NextPlanet.transform.parent.GetComponent(PlanetSearcher).Invincible = false;
			
			StartPhase = 1000;
			Phase2 = false;
		}
		if (Camera.main.transform.position.y <= NextPlanet.transform.position.y && Phase3) //phase 3
		{
			StartPhase = 1000;
			Phase3 = false;
		}
	}
}

function OnTriggerEnter(info : Collider) 
{
	//red asteroid death
	if (info.gameObject.name == "RedAsteroid" && transform.parent == null && !Invincible)
	{
		Alive = false;
		GameObject.Instantiate(PlanetExplosion, transform.position, Quaternion(0,0,0,0));
		transform.position = Vector3(1000, 1000, 1000);
		transform.gameObject.tag = "DEAD"; 
	}
	//Debris Fields Functionality
	if(info.gameObject.name == "Debris" && transform.parent == null && !Invincible)
	{
		//dragControls.selectedWorld = null;
		dragControls.worldSelected = false;
	}

}

