#pragma strict

//public vars
public var SecondTutPos : Vector3; //the position for the second round tutorial
public var AnywhereTut : GameObject; //the small text saying (ANYWHERE)
public var RoundOneTwoPos : Vector3;  //the position for the middle round tutorial

//private vars
private var dragControls : DragControlsPC;
private var ShowVirgin = true; //if the text has been shown
private var RoundTwo = false; //if going to show the second double tap here
private var RoundOne = true; //if going to show the first double tap here
private var IntroStop = true; //stop hiding at the intro anim

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
	
	//showing round one
	if (dragControls.canMoveToPlay && ShowVirgin && !RoundTwo && RoundOne)
	{
		print("showing one");
		Type("DOUBLE TAP HERE");
		ShowVirgin = false;
		IntroStop = false;
	}
	
	//hiding round one, then show the middle round
	if (dragControls.canMoveToWorld && RoundOne && !IntroStop && !RoundTwo)
	{
		RoundOneHiding();
	}
	
	//showing round two
	if (dragControls.canMoveToPlay && RoundTwo && ShowVirgin && !RoundOne)
	{
		RoundTwoShowing();
	}
	
	//hiding round two
	if (dragControls.canMoveToWorld && RoundTwo && !IntroStop)
	{
		print("hiding two");
		RoundTwo = false;
		RoundOne = false;
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

//hiding for round one and showing round one two
function RoundOneHiding()
{
	print("hiding one");
	RoundOne = false;
	RoundTwo = true;
	ShowVirgin = true;
	IntroStop = true;
	
	yield StartCoroutine(Type(" "));
	transform.localPosition = RoundOneTwoPos;
	AnywhereTut.SendMessage("Type","(ANYWHERE)");
	AnywhereTut.transform.localPosition = Vector3(-2.63, -0.58, 25.66);
	yield WaitForSeconds(0.2);
	yield StartCoroutine(Type("NOW DOUBLE TAP AGAIN"));
}

//show round two
function RoundTwoShowing()
{
	print("showing two");	
	ShowVirgin = false;
	IntroStop = false;
	
	//hide middle round
	yield StartCoroutine(Type(" "));
	AnywhereTut.SendMessage("Type"," ");
	yield WaitForSeconds(0.2);
	transform.localPosition = SecondTutPos;
	Type("DOUBLE TAP HERE");
}