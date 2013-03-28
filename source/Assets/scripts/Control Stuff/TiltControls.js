#pragma strict

//public vars
public var UseTiltControls : boolean; //if useing the tilt controls at all or not
static var Speed : float; //speed at which the camera moves

//private vars
private var dragControls : DragControlsPC;
private var center : Vector3;
private var centerVirgin = true; //if the center point has been set it
private var tiltStick = 0.16; //the zone which tilt won't do anything

function Start () 
{
	//get dragcontrols
	dragControls = Camera.main.GetComponent(DragControlsPC);
	
	//init speed
	if (Speed == 0)
	{
		Speed = 20;
	}
}

function Update () 
{
	if (UseTiltControls && dragControls.canMoveToWorld && !dragControls.levelWon && !dragControls.halt)
	{
		//set center
		if (centerVirgin)
		{
			center = Input.acceleration;
			centerVirgin = false;
		}
		
		//horizontal movement, x
		if ((Input.acceleration.x - center.x) > tiltStick || (Input.acceleration.x - center.x) < (tiltStick * -1))
		{
			if (dragControls.WorldDraggingInverted)
			{
				Camera.main.transform.position.y = Mathf.MoveTowards(Camera.main.transform.position.y, Camera.main.transform.position.y + ((Input.acceleration.x - center.x) * Speed * Time.deltaTime * -1), Speed);
			}
			else
			{
				Camera.main.transform.position.y = Mathf.MoveTowards(Camera.main.transform.position.y, Camera.main.transform.position.y + (Input.acceleration.x - center.x) * Speed * Time.deltaTime, Speed);
			}
		}
		//vertical movement, y
		if ((Input.acceleration.y - center.y) > tiltStick || (Input.acceleration.y - center.y) < (tiltStick * -1))
		{
			if (dragControls.WorldDraggingInverted)
			{
				Camera.main.transform.position.x = Mathf.MoveTowards(Camera.main.transform.position.x, Camera.main.transform.position.x + (Input.acceleration.y - center.y) * Speed * Time.deltaTime, Speed);
			}
			else
			{
				Camera.main.transform.position.x = Mathf.MoveTowards(Camera.main.transform.position.x, Camera.main.transform.position.x + (Input.acceleration.y - center.y) * Speed * Time.deltaTime * -1, Speed);
			}
		}
	}
}

function OnGUI ()
{
	Speed = GUI.HorizontalSlider (Rect (25, 80, 100, 30), Speed, 20.0, 50.0);
}