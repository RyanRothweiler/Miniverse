#pragma strict

//public vars

//private vars
private var timer : LevelTimer;
private var peopleCounter : PeopleCounter;
private var mat : Material;
private var fadedIn : boolean;
private var dragControls : DragControlsPC;

function Start () 
{
	//get stuff
	dragControls = camera.main.GetComponent(DragControlsPC);
	timer = Camera.main.GetComponent(LevelTimer);
	peopleCounter = Camera.main.transform.Find("PeopleCounter").GetComponent(PeopleCounter);
	
	mat = renderer.material; //get material
	mat.color.a = 0; //hide text
	
	//init
	fadedIn = false;
}

function Update () 
{
	//fade in
	if (!fadedIn && !dragControls.halt)
	{
		fadedIn = true;
		FadeIn();
	}
	
	//fade out
	if (peopleCounter.LevelDone)
	{
		FadeOut();
	}
	
	//parent to camera
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
	
	//update timer
	//print(timer.GetTime());
	
}

//fade in the numbers
function FadeIn()
{
	//yield WaitForSeconds(1); //wait a bit for the spaceship
	//fade in
	do
	{
		yield;
		mat.color.a += 0.008;
	} while (mat.color.a < 0.8);
}

//fade out the numbers
function FadeOut()
{
	yield WaitForSeconds(0.5); //wait a bit
	//fade out
	do
	{
		yield;
		mat.color.a -= 0.008;
	} while (mat.color.a > 0);
}