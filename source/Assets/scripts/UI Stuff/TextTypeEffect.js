#pragma strict

//public vars
public var TextToType : String;
public var waitTime : float;
public var Done = false;

//private vars
private var i : int;
private var str : String;

function Start () 
{

}

function Update () 
{
	//again wait until not transitioning
	if ((transform.parent == null) && !Done)
	{
		Done = true;
		Type(TextToType);
	}
}

function Type(text : String) //an effect of typing in something
{
	yield WaitForSeconds(waitTime);
	for (i = 0; i < text.Length; i++)
	{
		str = str + text[i];
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(0.05);
	}
}