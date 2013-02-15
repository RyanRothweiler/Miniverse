#pragma strict
//controls the people counter on the spaceship which tells the player how many people are saved out of how many


//public vars
public var savedCount : int; //number of people saved
public var LevelDone : boolean; //if the level is beat

//private vars
private var dragControls : DragControlsPC;
private var fadedIn : boolean;
private var mat : Material;
private var peopleGoal : int; //number of people that must to be saved
private var i : int; 
private var colorRate : Color;

function Start () 
{
	//get drag controls
	dragControls = camera.main.GetComponent(DragControlsPC);
	
	//init
	fadedIn = false;
	LevelDone = false;
	
	mat = renderer.material; //get material
	mat.color.a = 0; //hide text
	
	//init people goals
	savedCount = 0;
	peopleGoal = dragControls.peopleGoal;
	GetComponent(TextMesh).text = savedCount + "/" + peopleGoal;
	
	//get color increment amount
	colorRate = (Color.green - mat.color) / (peopleGoal);
	
}

function Update () 
{
	//fade in
	if (!fadedIn && !dragControls.halt)
	{
		fadedIn = true;
		FadeIn();
	}
	
	//if hit the win condition
	if (savedCount == peopleGoal)
	{
		LevelDone = true;
		FadeOut();
	}
	
	//parent to camera
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
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
		mat.color.a += 0.008;
	} while (mat.color.a < 1);
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

//increment the count and change the color
function Increment(amount : int)
{
	for (i = 0; i < amount; i++)
	{
		//change the color
		//mat.color += colorRate;
		FadeInColor(mat.color + colorRate);
		
		//update text
		savedCount++;
		GetComponent(TextMesh).text = savedCount + "/" + peopleGoal;
		
		//wait a bit
		yield WaitForSeconds(0.1);
	}
}
 
//fade in a color
function FadeInColor(target : Color)
{
	do
	{
		yield;
		mat.color += colorRate / 10;
	} while ( (Mathf.Round(mat.color.r * 100f) / 100f) != (Mathf.Round(target.r * 100f) / 100f) );
}