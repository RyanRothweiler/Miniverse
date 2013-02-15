#pragma strict

//public vars
public var cont = false;

//private vars
private var planetsearcher : PlanetSearcher;
private var dragControls : DragControlsPC;

private var touchGo = true;
private var dragGo = false;
private var tapGo = false;

private var i : int;
private var x : int;
private var str : String;

private var levelWonGone = false;

function Start () 
{
	//get other objects
	planetsearcher = transform.parent.GetComponent(PlanetSearcher);
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	//hold things off for a bit
	HoldOff();
	
	//tutorial level things
	if (planetsearcher.nearestPlanet != null && cont)
	{
		if (!planetsearcher.Selected && planetsearcher.nearestPlanet.name != "humanShip" && !levelWonGone)
		{
			if (touchGo)
			{
				StopAllCoroutines();
				Type("TOUCH");
				touchGo = false;
				dragGo = true;
				tapGo = true;
			}
		}
		if (planetsearcher.Selected && planetsearcher.nearestPlanet.name != "humanShip" && !levelWonGone)
		{
			if (dragGo)
			{
				StopAllCoroutines();
				Type("DRAG");
				dragGo = false;
				touchGo = true;
				tapGo = true;
			}
		}
		if (planetsearcher.Selected && planetsearcher.nearestPlanet.name == "humanShip" && !levelWonGone)
		{
			if (tapGo)
			{
				StopAllCoroutines();
				Type("TAP");
				tapGo = false;
				touchGo = true;
				dragGo = true;
			}
		}
	}
	
	//if level beat
	if (dragControls.levelWon && !levelWonGone)
	{
		levelWonGone = true;
		StopAllCoroutines();
		Type(" ");
	}
}

function Type(text : String) //an effect of typing in something
{
	//untype old text
	str = GetComponent(TextMesh).text;
	x = str.Length;
	for (i = 0; i < x; i++)
	{
		str = str.Substring(0, str.Length - 1);
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(0.05);
	}
	
	for (i = 0; i < text.Length; i++)
	{
		str = str + text[i];
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(0.05);
	}
}

function HoldOff()
{
	yield WaitForSeconds(6);
	cont = true;
}