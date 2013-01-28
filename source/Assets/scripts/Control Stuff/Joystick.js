#pragma strict

//public vars
public var UseJoystickControls = true;

public var JoyStickOutsideObj : GameObject;
public var JoyStickInsideObj : GameObject;
public var JoystickInsideOffsetObj : GameObject;

//private vars
private var DragControls : DragControlsPC;

private var WorldVector3 : Vector3;
private var Home : Vector3; //the zero of the joystick 
private var fVector : Vector3;
private var dummyRay : Ray; 
private var Touch1Start : boolean; 
private var distance : float;


function Start () 
{ 
	//if not using then turn off the controls
	if (!UseJoystickControls)
	{
   		JoyStickOutsideObj.renderer.enabled = false;
		JoyStickInsideObj.renderer.enabled = false;
		JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
	}
	
	//set DragControls
	DragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (UseJoystickControls)
	{
		//disable textures 
		JoyStickOutsideObj.renderer.enabled = false;
		JoyStickInsideObj.renderer.enabled = false;
		JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
			
		//if dragging camera with touch 1
		if (DragControls.Touching1 && !DragControls.Touch1WorldSelected)
		{
			if (Touch1Start)
			{ 
				Touch1Start = false;
	
				//get and set zero
				Home = Camera.main.ScreenToWorldPoint(Vector3(DragControls.Touch1StartPos.x,DragControls.Touch1StartPos.y,DragControls.WorldZDepth - Camera.main.transform.position.z));
				JoyStickOutsideObj.transform.position = Home;
			} 
			//control renderers
			JoyStickInsideObj.renderer.enabled = true; 
			JoyStickOutsideObj.renderer.enabled = true;
			JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
			
			//move inside joystick while limiting its movement
			WorldVector3 = Camera.main.ScreenToWorldPoint(Vector3(DragControls.Touch1EndPos.x,DragControls.Touch1EndPos.y,DragControls.WorldZDepth - Camera.main.transform.position.z));
			distance = Vector3.Distance(WorldVector3, Home);
			if (distance < 0.6)
			{
				JoyStickInsideObj.transform.position = WorldVector3; 
			}
			else
			{
				//control renderers
				JoyStickInsideObj.renderer.enabled = false; 
				JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = true;
				
				//point joystick at touch
				JoystickInsideOffsetObj.transform.position = Home;
				JoystickInsideOffsetObj.transform.LookAt(WorldVector3,fVector); //set again
			    if(JoystickInsideOffsetObj.transform.localEulerAngles.y > 100)
			    {
			       	fVector = Vector3(0,0,1);
			    }
			    else
			    {
			     	fVector = Vector3(0,0,-1);
			    }
			    
			    //point selector at planet
			    JoystickInsideOffsetObj.transform.LookAt(WorldVector3,fVector);			
				
				//JoyStickInsideObj.transform.position = WorldVector3;
				//JoyStickInsideObj.transform.position = JoyStickInsideObj.transform.position.normalized * 0.6;
			}
		}
		else
		{
			Touch1Start = true;
		}
		
		//if dragging camera with touch 2
		if (DragControls.Touch2CameraDragging)
		{
		}
		
		//make sure the textures are parented to the camera
		if (JoyStickInsideObj.transform.parent == null || JoyStickOutsideObj.transform.parent == null)
		{
			JoyStickInsideObj.transform.parent = Camera.main.transform;
			JoyStickOutsideObj.transform.parent = Camera.main.transform;
		}
	}
}