#pragma strict

//public vars

//private vars
private var planetsearcher : PlanetSearcher;

private var touchGo = true;
private var dragGo = false;
private var tapGo = false;

private var i : int;
private var x : int;
private var str : String;
public var cont = false;

function Start () 
{
	//get planet controller
	planetsearcher = transform.parent.GetComponent(PlanetSearcher);
}

function Update () 
{
	//hold things off for a bit
	HoldOff();
	
	//tutorial level things
	if (planetsearcher.nearestPlanet != null && cont)
	{
		if (!planetsearcher.Selected && planetsearcher.nearestPlanet.name != "humanShip")
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
		if (planetsearcher.Selected && planetsearcher.nearestPlanet.name != "humanShip")
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
		if (planetsearcher.Selected && planetsearcher.nearestPlanet.name == "humanShip")
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