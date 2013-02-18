#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;
private var virgin = true;

private var str : String;
private var i : int;
private var x : int;

function Start () 
{
	//get stiff
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (dragControls.canMoveToPlay && virgin)
	{
		Type(" ");
		virgin = false;
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
		yield WaitForSeconds(dragControls.TutorialTypeSpeed);
	}
	
	//type in new text
	for (i = 0; i < text.Length; i++)
	{
		str = str + text[i];
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(dragControls.TutorialTypeSpeed);
	}
}