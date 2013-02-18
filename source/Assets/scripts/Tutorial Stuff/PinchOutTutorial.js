#pragma strict

//public vars

//private vars
private var dragControls : DragControlsPC;
private var ShowVirgin = true; //if the text has been shown
private var HideVirgin = true; //if the text has been hiden

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
	//star parented
	if (transform.parent == null)
	{
		transform.parent = Camera.main.transform;
	}
	
	//showing
	if (dragControls.canMoveToPlay && ShowVirgin)
	{
		Type("PINCH OUT");
		ShowVirgin = false;
	}
	//hiding
	if (dragControls.canMoveToWorld)
	{
		HideVirgin = false;
		StopAllCoroutines();
		Type(" ");
	}
}

function Type(text : String) //an effect of typing in something
{
	//waiting a bit on the first zoom out
	if (ShowVirgin)
	{
		yield WaitForSeconds(0.5);
	}
	
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