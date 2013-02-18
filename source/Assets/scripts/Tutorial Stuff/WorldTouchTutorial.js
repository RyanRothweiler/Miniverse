#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;
private var i : int;
private var x : int;
private var str : String;

private var dragGo : boolean;
private var touchGo : boolean;

function Start () 
{
	//init
	dragGo = true;
	touchGo = false;
	
	//get drag controls
	dragControls = Camera.main.GetComponent(DragControlsPC);
}

function Update () 
{
	if (dragControls.Touching1 && dragGo) //if touching
	{
		StopAllCoroutines();
		dragGo = false;
		touchGo = true;
		Type("DRAG");
	}
	if (!dragControls.Touching1 && touchGo)
	{
		StopAllCoroutines();
		dragGo = true;
		touchGo = false;
		Type("TOUCH");
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
		yield WaitForSeconds(dragControls.TutorialTypeSpeed);
	}
	
	for (i = 0; i < text.Length; i++)
	{
		str = str + text[i];
		GetComponent(TextMesh).text = str;
		yield WaitForSeconds(dragControls.TutorialTypeSpeed);
	}
}