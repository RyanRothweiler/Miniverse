#pragma strict

//public vars
public var Speed : float;

public var UseJoystickControls = true;

public var JoyStickOutsideObj : GameObject;
public var JoyStickInsideObj : GameObject;
public var JoystickInsideOffsetObj : GameObject;

//private vars
private var dragControls : DragControlsPC;
private var dummyRay : Ray; 
private var Touch1Start : boolean; 
private var distance : float;

private var WorldVector3 : Vector3;
private var Home : Vector3; //the zero of the joystick 
private var fVector : Vector3;
private var direction : Vector3; //the direction the camera is moving


function Start () 
{ 
	//if not using then turn off the controls
	if (!UseJoystickControls)
	{
   		JoyStickOutsideObj.renderer.enabled = false;
		JoyStickInsideObj.renderer.enabled = false;
		JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
	}
	
	//set dragControls
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (UseJoystickControls && !dragControls.LevelPaused)
	{
		//disable textures 
		JoyStickOutsideObj.renderer.enabled = false;
		JoyStickInsideObj.renderer.enabled = false;
		JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
			
		//if dragging camera with touch 1
		if (dragControls.Touching1 && !dragControls.Touch1WorldSelected)
		{
			if (Touch1Start)
			{ 
				Touch1Start = false;
	
				//get and set zero
				Home = Camera.main.ScreenToWorldPoint(Vector3(dragControls.Touch1StartPos.x,dragControls.Touch1StartPos.y,dragControls.WorldZDepth - Camera.main.transform.position.z));
				JoyStickOutsideObj.transform.position = Home;
			} 
			
			//control renderers
			JoyStickInsideObj.renderer.enabled = true; 
			JoyStickOutsideObj.renderer.enabled = true;
			JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
			
			//move inside joystick while limiting its movement
			WorldVector3 = Camera.main.ScreenToWorldPoint(Vector3(dragControls.Touch1EndPos.x,dragControls.Touch1EndPos.y,dragControls.WorldZDepth - Camera.main.transform.position.z));
			distance = Vector3.Distance(WorldVector3, Home);
			if (distance < 0.6)
			{
				JoyStickInsideObj.transform.position = WorldVector3; 
				direction = ((dragControls.Touch1StartPos - dragControls.Touch1EndPos) / 1000) * -1;
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
			    
			    //get direction
			    direction = ((dragControls.Touch1StartPos - dragControls.Touch1EndPos) / Speed) * -1;		
			}
				
			//use direction
			if (dragControls.WorldDraggingInverted)
			{
				Camera.main.transform.position += direction;
				Home += direction;
			}
			else
			{
				Camera.main.transform.position += direction * -1;
				Home += direction * -1;
			}
			
		}
		else
		{
			Touch1Start = true;
		}
		
		
		//if dragging camera with touch 2
		if (dragControls.Touching2 && !dragControls.Touch2WorldSelected)
		{
			if (Touch1Start)
			{ 
				Touch1Start = false;
	
				//get and set zero
				Home = Camera.main.ScreenToWorldPoint(Vector3(dragControls.Touch2StartPos.x,dragControls.Touch2StartPos.y,dragControls.WorldZDepth - Camera.main.transform.position.z));
				JoyStickOutsideObj.transform.position = Home;
			} 
			
			//control renderers
			JoyStickInsideObj.renderer.enabled = true; 
			JoyStickOutsideObj.renderer.enabled = true;
			JoystickInsideOffsetObj.transform.GetChild(0).renderer.enabled = false;
			
			//move inside joystick while limiting its movement
			WorldVector3 = Camera.main.ScreenToWorldPoint(Vector3(dragControls.Touch2EndPos.x,dragControls.Touch2EndPos.y,dragControls.WorldZDepth - Camera.main.transform.position.z));
			distance = Vector3.Distance(WorldVector3, Home);
			if (distance < 0.6)
			{
				JoyStickInsideObj.transform.position = WorldVector3; 
				direction = ((dragControls.Touch2StartPos - dragControls.Touch2EndPos) / 1000) * -1;
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
			    
			    //get direction
			    direction = ((dragControls.Touch2StartPos - dragControls.Touch2EndPos) / Speed) * -1;		
			}
				
			//use direction
			Camera.main.transform.position += direction;
			Home += direction;
		}
		else
		{
			Touch1Start = true;
		}
		
		//make sure the textures are parented to the camera
		if (JoyStickInsideObj.transform.parent == null || JoyStickOutsideObj.transform.parent == null)
		{
			JoyStickInsideObj.transform.parent = Camera.main.transform;
			JoyStickOutsideObj.transform.parent = Camera.main.transform;
		}
	}
}