#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;
private var fadedIn = false;
private var mat : Material;

function Start () 
{
	//set drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
	
	mat = renderer.material; //get material
	mat.SetColor("_TintColor", Color(1,1,1,0)); //hide text
}

function Update () 
{

	//parent to camera
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
	
	//fade in
	if (!fadedIn && !dragControls.halt)
	{
		fadedIn = true;
		FadeIn();
	}
	if (!fadedIn && dragControls.isLevelSelect)
	{
		fadedIn = true;
		FadeIn();
	}
	
	//fade out
	if (dragControls.nextLevel)
	{
		FadeOut();
	}
	
}
//fade in the numbers
function FadeIn()
{
	//yield WaitForSeconds(1); //wait a bit for the spaceship
	//fade in
	do
	{
		yield;
		mat.SetColor("_TintColor", Color(1,1,1,mat.GetColor("_TintColor").a + 0.003));
	} while (mat.GetColor("_TintColor").a < 0.3);
}

//fade out the numbers
function FadeOut()
{
	yield WaitForSeconds(0.5); //wait a bit
	//fade out
	do
	{
		yield;
		mat.SetColor("_TintColor", Color(1,1,1,mat.GetColor("_TintColor").a - 0.003));
	} while (mat.GetColor("_TintColor").a > 0);
}