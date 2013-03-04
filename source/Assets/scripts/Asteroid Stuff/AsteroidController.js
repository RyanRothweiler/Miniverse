#pragma strict

//public vars
public var AsteroidRotation = true; // if the asteroid rotates around the sun or not
public var AsteroidCenter : GameObject; //the asteroid center
public var RotateSpeed = 1.0; //the speed of the asteroid
//public var selectLine : GameObject; //planets can share a select line but each asteroid must have their own select line
public var nearestPlanet : GameObject;
public var selectLine : GameObject; //the proximity indicator
public var RadiiObj : GameObject; //the radii object. no shit.

//private vars
private var fVector : Vector3;
private var objectPos : Vector3;
private var gameObjects = new Array();
private var nearestDistanceSqr : float; 
private var distanceSqr : float;
private var dragControls : DragControlsPC;
private var found : boolean;
private var radiiVirgin : boolean;;
private var indicatorFirstShow = true;
private var indicatorFirstHide = true;
private var oldRot : Vector3;
private var newRot : Vector3;

function Start ()
{
	//initialize variables
	found = false;
	radiiVirgin = true;
	
	//set drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
	
	//if asteroid rotates or not
	if (AsteroidRotation)
	{
		transform.Find("asteroid_MO").animation.Play("SunRotate");
		transform.Find("asteroid_MO").animation["SunRotate"].speed = RotateSpeed;
	}	
	else
	{
		transform.Find("asteroid_MO").animation.Play("AsteroidSmallRotate");
	}
		
	//fade in radii
	if (AsteroidRotation)
	{
		FadeInMat(RadiiObj.renderer.material);
		RadiiObj.animation["Default Take"].speed = -0.5;
	}
	else
	{
		FadeOutMat(RadiiObj.renderer.material);
	}
}

function Update () 
{
	//animation pausing
	if (!dragControls.LevelPaused)
	{
		//radii
		if (radiiVirgin && AsteroidRotation)
		{
			radiiVirgin = false; //reset variables
			FadeOutMat(RadiiObj.renderer.material); //fade in radii
		}
		
		//asteroid
		if (AsteroidRotation)
		{
			transform.Find("asteroid_MO").animation["SunRotate"].speed = RotateSpeed;
		}
		else
		{
			transform.Find("asteroid_MO").animation["AsteroidSmallRotate"].speed = 1;
		}
	}
	else
	{
		//radii
		if (!radiiVirgin && AsteroidRotation)
		{
			radiiVirgin = true;
			FadeInMat(RadiiObj.renderer.material); //fade out radii
		}
		
		//asteroid
		if (AsteroidRotation)
		{
			transform.Find("asteroid_MO").animation["SunRotate"].speed = 0;
		}
		else
		{
			transform.Find("asteroid_MO").animation["AsteroidSmallRotate"].speed = 0;
		}
	}
	
	//other stuff
	if (transform.parent == null)
	{
		//reset variables
		nearestDistanceSqr = Mathf.Infinity;
	    gameObjects = dragControls.worldObjects;
	    nearestPlanet = AsteroidCenter;
	    distanceSqr = 0.0;
	    objectPos = Vector3.zero;
	    found = false;
	    
	
	    // loop through each tagged object, remembering nearest one found
	    for (var obj : GameObject in gameObjects) 
	    {
		   	distanceSqr = 0;
		   	//if checking against an asteroid
		   	if (obj.name == "Asteroid")
		   		objectPos = obj.GetComponent(AsteroidController).AsteroidCenter.transform.position;
		   	else
		       	objectPos = obj.transform.position;
		       	
		    if (obj.transform != this.transform)
		    {
		       	distanceSqr = Mathf.Abs((objectPos - AsteroidCenter.transform.position).sqrMagnitude);
		      	
		       	//checks distance if obj is not found an 
		       	if (obj.name != "Asteroid" && distanceSqr < nearestDistanceSqr && distanceSqr < dragControls.worldDist && !obj.GetComponentInChildren(planetLifeIndicator).dead)
		       	{
		       		nearestPlanet = obj.gameObject;
		       		nearestDistanceSqr = distanceSqr;
		       		found = true;
		       	}
		       	if (obj.name == "Asteroid" && distanceSqr < nearestDistanceSqr && distanceSqr < dragControls.worldDist) //checks distance if obj is an asteroid
		       	{
		       		nearestPlanet = obj.gameObject;
		       		nearestDistanceSqr = distanceSqr;
		       		found = true;
		       	} 
		   	}
		} 
		
		//if found the closest planet then do this
		if (found)
		{
			//if found an asteroid
			if (nearestPlanet.name == "Asteroid")
			{
		        //reset nearest planet
		        nearestPlanet = nearestPlanet.GetComponent(AsteroidController).AsteroidCenter;
		        
		        if (indicatorFirstShow)
				{
					indicatorFirstShow = false;
					indicatorFirstHide = true;
					selectLine.GetComponentInChildren(ProximityIndicator).Show(); //show proximity indicator
				}
				
				//point the indicator
			    selectLine.transform.position = AsteroidCenter.transform.position;
			    if(selectLine.transform.localEulerAngles.y > 100)
			    {
			       	fVector = Vector3(0,0,1);
			    }
			    else
			    {
			     	fVector = Vector3(0,0,-1);
			    }
				selectLine.transform.LookAt(nearestPlanet.transform,fVector); //point at target
			}
			else
			{
				if (indicatorFirstShow)
				{
					indicatorFirstShow = false;
					indicatorFirstHide = true;
					selectLine.GetComponentInChildren(ProximityIndicator).Show(); //show proximity indicator
				}
				
				//point the indicator
			    selectLine.transform.position = AsteroidCenter.transform.position;
			    if(selectLine.transform.localEulerAngles.y > 100)
			    {
			       	fVector = Vector3(0,0,1);
			    }
			    else
			    {
			     	fVector = Vector3(0,0,-1);
			    }
				selectLine.transform.LookAt(nearestPlanet.transform,fVector); //point at target
	        }
		}
		else //if haven't found anything then turn off the select line
		{
			if (indicatorFirstHide)
			{
				indicatorFirstHide = false;
				indicatorFirstShow = true;
				selectLine.GetComponentInChildren(ProximityIndicator).Hide();
			}
		}
	}
}

//fade out the material
function FadeOutMat(mat : Material)
{
	do
	{
		mat.color.a -= Time.deltaTime * 10;
		yield WaitForSeconds(0.01);
	} while (mat.color.a > 0);
}

//fade in the material
function FadeInMat(mat : Material)
{
	do
	{
		mat.color.a += Time.deltaTime * 10;
		yield WaitForSeconds(0.01);
	} while (mat.color.a < 1);
}