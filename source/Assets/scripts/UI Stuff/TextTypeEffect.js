#pragma strict

//public vars
public var TextToType : String;
public var waitTime : float;
public var Done = false;
public var ParentCheck = true;
public var FadeOutOnWin = false;

//private vars
private var dragControls : DragControlsPC;

private var mat : Material;
private var i : int;
private var x : int;
private var str : String;
private var levelWon = false;

function Start () 
{
	//get things
	dragControls = Camera.main.GetComponent(DragControlsPC);
	mat = renderer.material;
}

function Update () 
{
	//again wait until not transitioning
	if ((transform.parent == null) && !Done)
	{
		Done = true;
		StopAllCoroutines();
		Type(TextToType);
	}
	if (!ParentCheck && !Done)
	{
		Done = true;
		StopAllCoroutines();
		Type(TextToType);
	}
	
	//check if the level is won
	if (dragControls.levelWon && !levelWon && FadeOutOnWin)
	{
		levelWon = true;
		FadeOut();
	}
}

function Type(text : String) //an effect of typing in something
{	
	//type away old text
	str = GetComponent(TextMesh).text;
	x = str.Length;
	for (i = 0; i < x; i++)
	{
		str = str.Substring(0, str.Length - 1);
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(0.05);
	}
	
	//type in new text
	yield WaitForSeconds(waitTime);
	for (i = 0; i < text.Length; i++)
	{
		str = str + text[i];
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(0.05);
	}
}

function FadeOut()
{
	do
	{
		mat.color.a -= 0.008;
		yield;
	} while (mat.color.a > 0.2);
}